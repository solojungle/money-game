import { useContext } from "react";
import { ZoneOverlapContext, type ZoneApi } from "./ZoneOverlapContext";

export function useZoneOverlap(): ZoneApi {
  const ctx = useContext(ZoneOverlapContext);
  if (!ctx) {
    throw new Error("useZoneOverlap must be used inside ZoneOverlapProvider");
  }
  return ctx;
}
