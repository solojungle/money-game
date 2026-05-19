import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide, PlaneGeometry, ShapeGeometry } from "three";
import { ROOM_WALL_THICK } from "../../../game/building/buildingConstants";
import type { RoomFace } from "../../../game/building/roomGeometry";
import { CausticsProjectedLayer } from "../effects/CausticsProjectedLayer";
import { BUILDING_HULL, BUILDING_WHITE } from "./buildingMaterials";
import { roundedRectShape, roundedRectWithHole } from "./roundedRectShape";

/** Softens outer corners on room slabs and wall panels (meters). */
const CORNER_RADIUS = 0.18;
const CAUSTIC_INSET = 0.03;

type RoomShellMeshProps = {
  width: number;
  height: number;
  depth: number;
  /** Circular cutouts on interior walls where hatches are placed. */
  hatchOpenings: { face: RoomFace; holeRadius: number }[];
};

function wallShapeGeometry(wallW: number, wallH: number, holeRadius: number) {
  const maxR = Math.min(wallW, wallH) * 0.48;
  const shape = roundedRectWithHole(
    wallW,
    wallH,
    CORNER_RADIUS,
    Math.min(holeRadius, maxR),
  );
  return new ShapeGeometry(shape);
}

function solidWallGeometry(wallW: number, wallH: number) {
  return new ShapeGeometry(roundedRectShape(wallW, wallH, CORNER_RADIUS));
}

type WallSpec = {
  position: [number, number, number];
  rotation: [number, number, number];
  wallW: number;
  wallH: number;
  face: RoomFace;
};

function wallSpecs(width: number, height: number, depth: number): WallSpec[] {
  const hx = width / 2;
  const hz = depth / 2;
  const t = ROOM_WALL_THICK;

  return [
    {
      face: "+z",
      position: [0, 0, hz - t / 2],
      rotation: [0, 0, 0],
      wallW: width,
      wallH: height,
    },
    {
      face: "-z",
      position: [0, 0, -hz + t / 2],
      rotation: [0, Math.PI, 0],
      wallW: width,
      wallH: height,
    },
    {
      face: "+x",
      position: [hx - t / 2, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      wallW: depth,
      wallH: height,
    },
    {
      face: "-x",
      position: [-hx + t / 2, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      wallW: depth,
      wallH: height,
    },
  ];
}

function causticWallPosition(
  spec: WallSpec,
  hx: number,
  hz: number,
  t: number,
) {
  switch (spec.face) {
    case "+z":
      return [0, 0, hz - t / 2 - CAUSTIC_INSET] as [number, number, number];
    case "-z":
      return [0, 0, -hz + t / 2 + CAUSTIC_INSET] as [number, number, number];
    case "+x":
      return [hx - t / 2 - CAUSTIC_INSET, 0, 0] as [number, number, number];
    case "-x":
      return [-hx + t / 2 + CAUSTIC_INSET, 0, 0] as [number, number, number];
  }
}

function WallPanel({
  spec,
  holeRadius,
  hx,
  hz,
  t,
}: {
  spec: WallSpec;
  holeRadius?: number;
  hx: number;
  hz: number;
  t: number;
}) {
  const geom = useMemo(() => {
    if (holeRadius != null && holeRadius > 0) {
      return wallShapeGeometry(spec.wallW, spec.wallH, holeRadius);
    }
    return solidWallGeometry(spec.wallW, spec.wallH);
  }, [spec.wallH, spec.wallW, holeRadius]);

  const causticPos = causticWallPosition(spec, hx, hz, t);

  return (
    <group>
      <mesh
        position={spec.position}
        rotation={spec.rotation}
        geometry={geom}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={BUILDING_WHITE}
          {...BUILDING_HULL}
          side={DoubleSide}
        />
      </mesh>
      <CausticsProjectedLayer
        geometry={geom}
        position={causticPos}
        rotation={spec.rotation}
        renderOrder={3}
      />
    </group>
  );
}

/** Hollow room hull with optional circular hatch cutouts on interior walls. */
export function RoomShellMesh({
  width,
  height,
  depth,
  hatchOpenings,
}: RoomShellMeshProps) {
  const t = ROOM_WALL_THICK;
  const hy = height / 2;
  const hx = width / 2;
  const hz = depth / 2;
  const hullMat = (
    <meshStandardMaterial color={BUILDING_WHITE} {...BUILDING_HULL} />
  );

  const holeByFace = useMemo(() => {
    const m = new Map<RoomFace, number>();
    for (const o of hatchOpenings) {
      m.set(o.face, o.holeRadius);
    }
    return m;
  }, [hatchOpenings]);

  const walls = useMemo(
    () => wallSpecs(width, height, depth),
    [width, height, depth],
  );

  const floorGeom = useMemo(
    () => new PlaneGeometry(width, depth),
    [width, depth],
  );
  const ceilingGeom = useMemo(
    () => new PlaneGeometry(width, depth),
    [width, depth],
  );

  const floorY = -hy + t + CAUSTIC_INSET;
  const ceilingY = hy - t - CAUSTIC_INSET;

  return (
    <group>
      <RoundedBox
        args={[width, t, depth]}
        radius={CORNER_RADIUS}
        smoothness={4}
        position={[0, -hy + t / 2, 0]}
        castShadow
        receiveShadow
      >
        {hullMat}
      </RoundedBox>
      <RoundedBox
        args={[width, t, depth]}
        radius={CORNER_RADIUS}
        smoothness={4}
        position={[0, hy - t / 2, 0]}
        castShadow
        receiveShadow
      >
        {hullMat}
      </RoundedBox>
      <CausticsProjectedLayer
        geometry={floorGeom}
        position={[0, floorY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={3}
      />
      <CausticsProjectedLayer
        geometry={ceilingGeom}
        position={[0, ceilingY, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={3}
      />
      {walls.map((spec) => (
        <WallPanel
          key={spec.face}
          spec={spec}
          holeRadius={holeByFace.get(spec.face)}
          hx={hx}
          hz={hz}
          t={t}
        />
      ))}
    </group>
  );
}
