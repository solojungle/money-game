import type { BufferGeometry } from "three";
import { CausticsProjectedLayer } from "./CausticsProjectedLayer";

type SeafloorCausticsLayerProps = {
  geometry: BufferGeometry;
  /** Local Z lift before parent rotation (becomes world-up). */
  lift?: number;
};

/** Seabed caustics — thin wrapper around {@link CausticsProjectedLayer}. */
export function SeafloorCausticsLayer({
  geometry,
  lift = 0.08,
}: SeafloorCausticsLayerProps) {
  return <CausticsProjectedLayer geometry={geometry} lift={lift} />;
}
