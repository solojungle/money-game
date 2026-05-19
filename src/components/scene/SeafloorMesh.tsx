import { useMemo } from "react";
import { SeafloorCausticsLayer } from "./effects/SeafloorCausticsLayer";
import { createSeafloorGeometry } from "./seafloorGeometry";

export function SeafloorMesh() {
  const geometry = useMemo(() => createSeafloorGeometry(), []);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          color="#fff0c8"
          emissive="#6a5020"
          emissiveIntensity={0.08}
          roughness={0.88}
        />
      </mesh>
      <SeafloorCausticsLayer geometry={geometry} />
    </group>
  );
}
