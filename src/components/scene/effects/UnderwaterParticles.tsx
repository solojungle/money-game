import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Points,
  PointsMaterial,
  Vector3,
} from "three";
import { submergedBlend } from "../../../game/world/waterLevel";
import { UNDERWATER_PARTICLES } from "./underwaterParticlesConfig";

type UnderwaterParticlesProps = {
  playerRef: RefObject<RapierRigidBody | null>;
};

function createParticleSprite(): CanvasTexture {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new CanvasTexture(canvas);
  }
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomSigned(): number {
  return Math.random() * 2 - 1;
}

type ParticleState = {
  geometry: BufferGeometry;
  material: PointsMaterial;
  texture: CanvasTexture;
  positions: Float32Array;
  velocities: Float32Array;
  phases: Float32Array;
};

function createParticleState(): ParticleState {
  const { count, volumeHalfExtents, colors, size, opacity } =
    UNDERWATER_PARTICLES;
  const [hx, hy, hz] = volumeHalfExtents;

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const colorA = new Color(colors[0]);
  const colorB = new Color(colors[1]);
  const particleColors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = randomInRange(-hx, hx);
    positions[i3 + 1] = randomInRange(-hy, hy);
    positions[i3 + 2] = randomInRange(-hz, hz);

    velocities[i3] =
      randomSigned() *
      randomInRange(
        UNDERWATER_PARTICLES.driftMin[0],
        UNDERWATER_PARTICLES.driftMax[0],
      );
    velocities[i3 + 1] = randomInRange(
      UNDERWATER_PARTICLES.driftMin[1],
      UNDERWATER_PARTICLES.driftMax[1],
    );
    velocities[i3 + 2] =
      randomSigned() *
      randomInRange(
        UNDERWATER_PARTICLES.driftMin[2],
        UNDERWATER_PARTICLES.driftMax[2],
      );

    phases[i] = Math.random() * Math.PI * 2;

    const tint = colorA.clone().lerp(colorB, Math.random());
    particleColors[i3] = tint.r;
    particleColors[i3 + 1] = tint.g;
    particleColors[i3 + 2] = tint.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(particleColors, 3));

  const texture = createParticleSprite();
  const material = new PointsMaterial({
    map: texture,
    size,
    sizeAttenuation: true,
    transparent: true,
    opacity,
    depthWrite: false,
    fog: true,
    vertexColors: true,
  });

  return { geometry, material, texture, positions, velocities, phases };
}

function wrapAxis(value: number, halfExtent: number): number {
  const span = halfExtent * 2;
  if (value > halfExtent) return value - span;
  if (value < -halfExtent) return value + span;
  return value;
}

export function UnderwaterParticles({ playerRef }: UnderwaterParticlesProps) {
  const pointsRef = useRef<Points>(null);
  const state = useMemo(() => createParticleState(), []);
  const prevAnchor = useRef(new Vector3());
  const anchorInitialized = useRef(false);

  useEffect(
    () => () => {
      state.geometry.dispose();
      state.material.dispose();
      state.texture.dispose();
    },
    [state],
  );

  useFrame(({ camera }, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const body = playerRef.current;
    if (!body) return;

    const submersion = submergedBlend(camera.position.y);
    state.material.opacity = UNDERWATER_PARTICLES.opacity * submersion;
    if (submersion < 0.02) return;

    const p = body.translation();
    const anchorY = p.y + UNDERWATER_PARTICLES.followYOffset;

    let playerDx = 0;
    let playerDy = 0;
    let playerDz = 0;
    if (anchorInitialized.current) {
      playerDx = p.x - prevAnchor.current.x;
      playerDy = anchorY - prevAnchor.current.y;
      playerDz = p.z - prevAnchor.current.z;
    } else {
      anchorInitialized.current = true;
    }
    prevAnchor.current.set(p.x, anchorY, p.z);

    points.position.set(p.x, anchorY, p.z);

    const [hx, hy, hz] = UNDERWATER_PARTICLES.volumeHalfExtents;
    const { positions, velocities, phases } = state;
    const count = UNDERWATER_PARTICLES.count;
    const t = performance.now() * 0.001;
    const wobble = UNDERWATER_PARTICLES.wobbleAmplitude;
    const freq = UNDERWATER_PARTICLES.wobbleFrequency;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      // Cancel parent motion so motes stay suspended in world space as you swim.
      positions[i3] -= playerDx;
      positions[i3 + 1] -= playerDy;
      positions[i3 + 2] -= playerDz;

      positions[i3] +=
        (velocities[i3] + Math.sin(t * freq + phase) * wobble) * delta;
      positions[i3 + 1] +=
        (velocities[i3 + 1] + Math.sin(t * freq * 0.9 + phase * 1.3) * wobble) *
        delta;
      positions[i3 + 2] +=
        (velocities[i3 + 2] + Math.cos(t * freq + phase * 0.7) * wobble) *
        delta;

      positions[i3] = wrapAxis(positions[i3], hx);
      positions[i3 + 1] = wrapAxis(positions[i3 + 1], hy);
      positions[i3 + 2] = wrapAxis(positions[i3 + 2], hz);
    }

    state.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points
      ref={pointsRef}
      geometry={state.geometry}
      material={state.material}
    />
  );
}
