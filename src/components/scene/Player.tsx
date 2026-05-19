import {
  CapsuleCollider,
  type RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useCallback, useRef } from "react";
import * as THREE from "three";
import {
  bodyYOnInteriorFloor,
  interiorFloorY,
  isInsideBaseInterior,
} from "../../game/building/interiorVolume";
import { getSwimProfile } from "../../game/character/profile";
import {
  isGroundedOnInteriorFloor,
  JUMP_VELOCITY,
  walkHorizontalVelocity,
} from "../../game/input/locomotion";
import {
  swimIntentToWorldVelocity,
  type SwimIntent,
} from "../../game/input/intent";
import { movementAllowed } from "../../game/state/movement";
import { useGameStore } from "../../store/gameStore";
import { depthFromPlayerY } from "../../game/presentation/hud";
import { resolveCurrentPrompt } from "../../game/world/performInteraction";
import { resolveLocomotionMode } from "../../game/world/waterLevel";
import type { AudioService } from "../../audio/audioService";

type PlayerProps = {
  audio: AudioService;
};

const _camFwd = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _worldUp = new THREE.Vector3(0, 1, 0);

const SWIM_GRAVITY_SCALE = 0.15;
const INTERIOR_GRAVITY_SCALE = 1;
const SWIM_DAMPING = 2.8;
const INTERIOR_DAMPING = 8;

export const Player = forwardRef<RapierRigidBody, PlayerProps>(function Player(
  { audio },
  ref,
) {
  const body = useRef<RapierRigidBody | null>(null);
  const { camera } = useThree();
  const setRigidRef = useCallback(
    (instance: RapierRigidBody | null) => {
      body.current = instance;
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref],
  );

  const [, getKeys] = useKeyboardControls();
  const prevInteract = useRef(false);
  const prevAscend = useRef(false);
  const wasDryLocomotion = useRef(false);
  const wasInInterior = useRef(false);
  const flashlightOn = useGameStore((s) => s.flashlightOn);

  useFrame(() => {
    const b = body.current;
    if (!b) return;

    const store = useGameStore.getState();
    if (!store.started) return;

    const keys = getKeys() as Record<string, boolean>;
    const intent: SwimIntent = {
      forward: Boolean(keys.forward),
      back: Boolean(keys.back),
      left: Boolean(keys.left),
      right: Boolean(keys.right),
      ascend: Boolean(keys.moveUp),
      descend: Boolean(keys.moveDown),
      sprint: Boolean(keys.sprint),
      interact: Boolean(keys.holster),
    };

    camera.getWorldDirection(_camFwd);
    _camFwd.y = 0;
    if (_camFwd.lengthSq() < 1e-10) {
      _camFwd.set(0, 0, -1);
    } else {
      _camFwd.normalize();
    }
    _camRight.crossVectors(_camFwd, _worldUp);
    if (_camRight.lengthSq() < 1e-10) {
      _camRight.set(1, 0, 0);
    } else {
      _camRight.normalize();
    }

    const profile = getSwimProfile();
    const canMove = movementAllowed(store);

    const t = b.translation();
    let px = t.x;
    let py = t.y;
    let pz = t.z;

    const inInterior = isInsideBaseInterior([px, py, pz], store.placedPieces);
    if (inInterior && !wasInInterior.current) {
      const floorY = interiorFloorY([px, py, pz], store.placedPieces);
      if (floorY != null) {
        py = bodyYOnInteriorFloor(floorY, profile.capsuleHalfHeight);
        b.setTranslation({ x: px, y: py, z: pz }, true);
        const lv = b.linvel();
        b.setLinvel({ x: lv.x, y: 0, z: lv.z }, true);
      }
    }
    wasInInterior.current = inInterior;

    const worldPos: [number, number, number] = [px, py, pz];
    store.setPlayerWorldPos({ x: px, y: py, z: pz });
    const depth = depthFromPlayerY(py);
    if (depth !== store.depthM) store.setPlayerDepth(depth);

    const headingDeg = (Math.atan2(_camFwd.x, _camFwd.z) * 180) / Math.PI;
    if (Math.abs(headingDeg - store.headingDeg) > 0.5) {
      store.setHeadingDeg(headingDeg);
    }

    const feetY = py - profile.capsuleHalfHeight;
    const dryLocomotion =
      resolveLocomotionMode(feetY, inInterior, intent.descend) === "dry";
    if (dryLocomotion !== wasDryLocomotion.current) {
      b.setGravityScale(
        dryLocomotion ? INTERIOR_GRAVITY_SCALE : SWIM_GRAVITY_SCALE,
        true,
      );
      b.setLinearDamping(dryLocomotion ? INTERIOR_DAMPING : SWIM_DAMPING);
      wasDryLocomotion.current = dryLocomotion;
    }

    if (canMove) {
      if (dryLocomotion) {
        const lv = b.linvel();
        const horiz = walkHorizontalVelocity(
          intent,
          { x: _camFwd.x, z: _camFwd.z },
          { x: _camRight.x, z: _camRight.z },
        );
        const floorY = inInterior
          ? interiorFloorY(worldPos, store.placedPieces)
          : null;
        const grounded =
          floorY != null &&
          isGroundedOnInteriorFloor({
            feetY,
            floorY,
            verticalVelocity: lv.y,
          });

        const jumpEdge = intent.ascend && !prevAscend.current;
        let vy = lv.y;
        if (jumpEdge && grounded) {
          vy = JUMP_VELOCITY;
        }

        b.setLinvel({ x: horiz.x, y: vy, z: horiz.z }, true);
      } else {
        const vel = swimIntentToWorldVelocity(
          intent,
          { x: _camFwd.x, z: _camFwd.z },
          { x: _camRight.x, z: _camRight.z },
          {
            baseSpeed: profile.swimSpeed,
            sprintMult: profile.sprintMult,
          },
        );
        b.setLinvel(vel, true);
      }
    } else {
      b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    prevAscend.current = intent.ascend;

    const interactEdge = intent.interact && !prevInteract.current;
    prevInteract.current = intent.interact;
    if (interactEdge && canMove && !store.inventoryOpen) {
      const beforeHarvested = store.harvestedIds.length;
      const beforeOpen = store.inventoryOpen;
      const prompt = resolveCurrentPrompt(
        store.activeInteractable,
        store.hotbarSlots,
        store.quickSlot,
      );
      store.tryInteract("holster");
      const next = useGameStore.getState();
      if (next.inventoryOpen && !beforeOpen) {
        audio.playOneShot(
          prompt?.action === "open_inventory" &&
            next.activeInteractable?.kind === "storage_locker"
            ? "pickup"
            : "ui_confirm",
        );
      } else if (next.harvestedIds.length > beforeHarvested) {
        audio.playOneShot("pickup");
      }
    }
  });

  const profile = getSwimProfile();

  return (
    <RigidBody
      ref={setRigidRef}
      colliders={false}
      position={[0, 4, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={SWIM_DAMPING}
      gravityScale={SWIM_GRAVITY_SCALE}
      userData={{ role: "player" }}
    >
      <CapsuleCollider
        args={[profile.capsuleHalfHeight, profile.capsuleRadius]}
      />
      <mesh visible={false} userData={{ role: "player" }}>
        <capsuleGeometry
          args={[profile.capsuleRadius, profile.capsuleHalfHeight * 2, 6, 12]}
        />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      {flashlightOn && (
        <spotLight
          position={[0, profile.eyeHeight * 0.9, 0]}
          angle={0.45}
          penumbra={0.4}
          intensity={1.4}
          distance={14}
          castShadow
        />
      )}
    </RigidBody>
  );
});
