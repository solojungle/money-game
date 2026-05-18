import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";

const COLLECT_MS = 300;

export function useCollectAnimation(harvested: boolean): {
  collecting: boolean;
  done: boolean;
  groupRef: React.RefObject<Group | null>;
} {
  const groupRef = useRef<Group | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [done, setDone] = useState(false);
  const startMs = useRef<number | null>(null);

  useEffect(() => {
    if (harvested && !collecting && !done) {
      setCollecting(true);
      startMs.current = null;
    }
  }, [harvested, collecting, done]);

  useFrame((state) => {
    if (!collecting || done) return;
    const now = state.clock.elapsedTime * 1000;
    if (startMs.current === null) startMs.current = now;
    const t = Math.min(1, (now - startMs.current) / COLLECT_MS);

    const group = groupRef.current;
    if (group) {
      const scale = 1 - t * 0.85;
      group.scale.setScalar(scale);
    }

    group?.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const mat of mats) {
        const std = mat as MeshStandardMaterial;
        if (!std.isMeshStandardMaterial) continue;
        std.transparent = true;
        std.opacity = 1 - t;
        std.emissiveIntensity =
          (std.userData.baseEmissive as number | undefined) ?? 0.4;
        std.emissiveIntensity *= 1 + t * 1.5;
      }
    });

    if (t >= 1) {
      setDone(true);
      setCollecting(false);
    }
  });

  return { collecting, done, groupRef };
}
