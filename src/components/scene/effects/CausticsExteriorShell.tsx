import { useMemo } from "react";
import { PlaneGeometry } from "three";
import { CausticsProjectedLayer } from "./CausticsProjectedLayer";

const CAUSTIC_INSET = 0.025;

type CausticsExteriorShellProps = {
  width: number;
  height: number;
  depth: number;
};

/**
 * World-projected caustics on the outward faces of box modules (lockers, fabricators, etc.).
 */
export function CausticsExteriorShell({
  width: w,
  height: h,
  depth: d,
}: CausticsExteriorShellProps) {
  const hx = w / 2;
  const hy = h / 2;
  const hz = d / 2;

  const topGeom = useMemo(() => new PlaneGeometry(w, d), [w, d]);
  const sideGeom = useMemo(() => new PlaneGeometry(d, h), [d, h]);
  const endGeom = useMemo(() => new PlaneGeometry(w, h), [w, h]);

  return (
    <group>
      <CausticsProjectedLayer
        geometry={topGeom}
        position={[0, hy + CAUSTIC_INSET, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={3}
      />
      <CausticsProjectedLayer
        geometry={topGeom}
        position={[0, -hy - CAUSTIC_INSET, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={3}
      />
      <CausticsProjectedLayer
        geometry={sideGeom}
        position={[hx + CAUSTIC_INSET, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={3}
      />
      <CausticsProjectedLayer
        geometry={sideGeom}
        position={[-hx - CAUSTIC_INSET, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        renderOrder={3}
      />
      <CausticsProjectedLayer
        geometry={endGeom}
        position={[0, 0, hz + CAUSTIC_INSET]}
        renderOrder={3}
      />
      <CausticsProjectedLayer
        geometry={endGeom}
        position={[0, 0, -hz - CAUSTIC_INSET]}
        rotation={[0, Math.PI, 0]}
        renderOrder={3}
      />
    </group>
  );
}
