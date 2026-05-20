import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Object3D } from "three";
import {
  clearSeafloorDunesMeshes,
  registerSeafloorDunesMeshes,
  sampleSeafloorWorldY,
} from "../../game/world/seafloorSurface";

type SeafloorSurfaceContextValue = {
  /** Bumps when dunes meshes are registered so spawn Y can refresh. */
  surfaceRevision: number;
  registerDunes: (root: Object3D) => void;
  sampleSpawnY: (x: number, z: number, offset?: number) => number;
};

const SeafloorSurfaceContext =
  createContext<SeafloorSurfaceContextValue | null>(null);

export function SeafloorSurfaceProvider({ children }: { children: ReactNode }) {
  const [surfaceRevision, setSurfaceRevision] = useState(0);

  const registerDunes = useCallback((root: Object3D) => {
    registerSeafloorDunesMeshes(root);
    setSurfaceRevision((n) => n + 1);
  }, []);

  const sampleSpawnY = useCallback(
    (x: number, z: number, offset = 0) => sampleSeafloorWorldY(x, z, offset),
    [surfaceRevision],
  );

  const value = useMemo(
    () => ({ surfaceRevision, registerDunes, sampleSpawnY }),
    [surfaceRevision, registerDunes, sampleSpawnY],
  );

  return (
    <SeafloorSurfaceContext.Provider value={value}>
      {children}
    </SeafloorSurfaceContext.Provider>
  );
}

export function useSeafloorSurface(): SeafloorSurfaceContextValue {
  const ctx = useContext(SeafloorSurfaceContext);
  if (!ctx) {
    throw new Error(
      "useSeafloorSurface must be used within SeafloorSurfaceProvider",
    );
  }
  return ctx;
}

/** Unregister dunes on teardown (e.g. hot reload). */
export function useSeafloorSurfaceCleanup(): () => void {
  return useCallback(() => {
    clearSeafloorDunesMeshes();
  }, []);
}
