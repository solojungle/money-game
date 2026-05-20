import type { BufferGeometry } from "three";
import { useCausticsMaterial } from "./CausticsProvider";

type CausticsProjectedLayerProps = {
  geometry: BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** Nudge along local +Z (legacy rotated seafloor plane). */
  lift?: number;
  /** Nudge along local +Y (upward-facing GLB sand). */
  liftY?: number;
  renderOrder?: number;
};

/**
 * World-projected caustics on any mesh (seafloor, base floors, interior walls).
 */
export function CausticsProjectedLayer({
  geometry,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  lift = 0,
  liftY = 0,
  renderOrder = 2,
}: CausticsProjectedLayerProps) {
  const material = useCausticsMaterial();

  return (
    <mesh
      geometry={geometry}
      position={[position[0], position[1] + liftY, position[2] + lift]}
      rotation={rotation}
      renderOrder={renderOrder}
      frustumCulled={false}
      material={material}
    />
  );
}
