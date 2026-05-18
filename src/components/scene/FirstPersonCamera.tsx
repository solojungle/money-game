import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useRef } from "react";
import type { RapierRigidBody } from "@react-three/rapier";
import { getSwimProfile } from "../../game/character/profile";
import { uiCapturesInput } from "../../game/state/uiInput";
import { useGameStore } from "../../store/gameStore";

const MOUSE_SENS = 0.0022;
const PITCH_MIN = -Math.PI / 2 + 0.08;
const PITCH_MAX = Math.PI / 2 - 0.08;

type FirstPersonCameraProps = {
  target: RefObject<RapierRigidBody | null>;
};

export function FirstPersonCamera({ target }: FirstPersonCameraProps) {
  const { camera, gl } = useThree();
  const yaw = useRef(Math.PI);
  const pitch = useRef(0);
  const bootstrapped = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: MouseEvent) => {
      if (uiCapturesInput(useGameStore.getState())) return;
      if (document.pointerLockElement !== canvas) return;
      yaw.current -= e.movementX * MOUSE_SENS;
      pitch.current = Math.max(
        PITCH_MIN,
        Math.min(PITCH_MAX, pitch.current - e.movementY * MOUSE_SENS),
      );
    };
    const onClick = () => {
      const store = useGameStore.getState();
      if (!store.started || uiCapturesInput(store)) return;
      if (document.pointerLockElement === canvas) return;
      canvas.requestPointerLock();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [gl]);

  useFrame(() => {
    const body = target.current;
    if (!body) return;

    const store = useGameStore.getState();
    if (!store.started) return;

    const profile = getSwimProfile();
    const p = body.translation();

    if (!bootstrapped.current) {
      bootstrapped.current = true;
    }

    const eyeY = p.y + profile.eyeHeight;
    camera.position.set(p.x, eyeY, p.z);
    const cp = Math.cos(pitch.current);
    const lookX = p.x - Math.sin(yaw.current) * cp;
    const lookY = eyeY + Math.sin(pitch.current);
    const lookZ = p.z - Math.cos(yaw.current) * cp;
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}
