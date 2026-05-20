import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { DUNES_MESH_SCALE } from "../../game/world/seafloorSurface";
import { prepareGlbWithCaustics } from "./models/prepareGlbCaustics";
import { WATER_DUNES_GLB_URL } from "./models/fishModelPaths";
import { SeafloorGlbCausticsLayers } from "./SeafloorGlbCausticsLayers";
import {
  useSeafloorSurface,
  useSeafloorSurfaceCleanup,
} from "./SeafloorSurfaceContext";

/** Seafloor dunes from manthrax/fish `waterdunes.glb` with projected caustics. */
export function SeafloorGlbMesh() {
  const { scene } = useGLTF(WATER_DUNES_GLB_URL);
  const { registerDunes } = useSeafloorSurface();
  const cleanup = useSeafloorSurfaceCleanup();

  const dunes = useMemo(
    () =>
      prepareGlbWithCaustics(scene, {
        sandColor: "#e4b868",
        scaleUvs: 0.025,
        meshScale: DUNES_MESH_SCALE,
        applyCaustics: false,
        receiveShadow: true,
        castShadow: false,
      }),
    [scene],
  );

  useEffect(() => {
    registerDunes(dunes);
    return cleanup;
  }, [dunes, registerDunes, cleanup]);

  return (
    <>
      <primitive object={dunes} />
      <SeafloorGlbCausticsLayers dunesRoot={dunes} />
    </>
  );
}
