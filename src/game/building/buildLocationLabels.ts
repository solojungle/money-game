import type { BuildLocation } from "./types";

export const BUILD_LOCATION_LABELS: Record<BuildLocation, string> = {
  seabed: "Buildable on seabed or foundation",
  base_exterior: "Buildable on base exterior",
  base_face: "Buildable on module faces",
  interior: "Buildable in base interiors",
  interior_floor: "Buildable on interior floor",
  interior_wall: "Buildable on interior walls",
  interior_ceiling: "Buildable on ceiling",
};

export function buildLocationLabel(loc: BuildLocation): string {
  return BUILD_LOCATION_LABELS[loc];
}
