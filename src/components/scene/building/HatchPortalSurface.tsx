import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CanvasTexture,
  DoubleSide,
  type Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

const PORTAL_BASE = "#0a1848";
const PORTAL_GLOW = "#3d5cff";
const PORTAL_BRIGHT = "#7eb8ff";

function createPortalTexture(): CanvasTexture {
  const w = 128;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, "#060e28");
  grad.addColorStop(0.2, PORTAL_BASE);
  grad.addColorStop(0.45, PORTAL_GLOW);
  grad.addColorStop(0.55, PORTAL_BRIGHT);
  grad.addColorStop(0.8, PORTAL_GLOW);
  grad.addColorStop(1, "#060e28");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let x = 0; x < w; x += 6) {
    const a = 0.12 + (x % 12) * 0.02;
    ctx.fillStyle = `rgba(140, 190, 255, ${a})`;
    ctx.fillRect(x, 0, 3, h);
  }

  const tex = new CanvasTexture(canvas);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

type HatchPortalSurfaceProps = {
  radius: number;
  z: number;
  ghostColor?: string;
  ghostOpacity?: number;
};

/** Minecraft nether-portal style: scrolling blue shimmer, emissive, walk-through. */
export function HatchPortalSurface({
  radius,
  z,
  ghostColor,
  ghostOpacity,
}: HatchPortalSurfaceProps) {
  const meshRef = useRef<Mesh>(null);
  const texture = useMemo(() => createPortalTexture(), []);
  const ghost = ghostColor != null;

  useFrame((_, delta) => {
    texture.offset.y = (texture.offset.y - delta * 0.45) % 1;
    const raw = meshRef.current?.material;
    if (!raw || Array.isArray(raw) || ghost) return;
    const mat = raw as MeshStandardMaterial;
    const t = performance.now() * 0.001;
    mat.emissiveIntensity = 1.15 + Math.sin(t * 3.2) * 0.22;
    mat.opacity = 0.58 + Math.sin(t * 2.4) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, z]} renderOrder={3}>
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial
        map={ghost ? undefined : texture}
        color={ghost ? ghostColor! : PORTAL_GLOW}
        emissive={ghost ? ghostColor! : PORTAL_BRIGHT}
        emissiveIntensity={ghost ? 0.6 : 1.15}
        transparent
        opacity={ghost ? (ghostOpacity ?? 0.4) * 0.7 : 0.58}
        metalness={0.05}
        roughness={0.15}
        side={DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
