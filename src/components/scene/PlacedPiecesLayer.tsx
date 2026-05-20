import {
  getPiece,
  getScaledGhostSize,
  hatchOpeningsForRoom,
} from "../../game/building";
import type { BuilderCategory, PlacedPiece } from "../../game/building";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { useGameStore } from "../../store/gameStore";
import { BuildingColliders } from "./building/BuildingColliders";
import { HatchMesh } from "./building/HatchMesh";
import { BUILDING_HULL, BUILDING_WHITE } from "./building/buildingMaterials";
import { CorridorShellMesh } from "./building/CorridorShellMesh";
import { RoomShellMesh } from "./building/RoomShellMesh";
import { CausticsExteriorShell } from "./effects/CausticsExteriorShell";

const LOCKER_ACCENT = "#f57c00";

const CATEGORY_TINT: Record<BuilderCategory, string> = {
  standard_elements: "#f8fafc",
  interior_facilities: "#86efac",
  exterior_facilities: "#fcd34d",
  utility: "#93c5fd",
  furniture_decor: "#f9a8d4",
  cultivation: "#6ee7b7",
};

function showcaseColor(pieceId: string): string {
  const cat = getPiece(pieceId)?.category;
  if (!cat) return BUILDING_WHITE;
  return CATEGORY_TINT[cat];
}

function PieceMesh({
  piece,
  placed,
}: {
  piece: PlacedPiece;
  placed: PlacedPiece[];
}) {
  const def = getPiece(piece.pieceId);
  const [w, h, d] = getScaledGhostSize(piece.pieceId);
  const isLocker =
    piece.pieceId === "piece_wall_locker" ||
    piece.pieceId === "piece_floor_locker";
  const isSolar = piece.pieceId.includes("solar");
  const isRoom =
    piece.pieceId === "piece_room" ||
    piece.pieceId === "piece_half_round_room" ||
    piece.pieceId === "piece_nook" ||
    piece.pieceId === "piece_moonpool";
  const isCorridor = piece.pieceId === "piece_corridor";
  const isHatch = piece.pieceId === "piece_hatch";
  const isWindow = piece.pieceId === "piece_window";
  const isLight =
    piece.pieceId.includes("light") ||
    piece.pieceId.includes("lamp") ||
    piece.pieceId === "piece_spotlight";

  const zoneId =
    def?.containerDefId != null
      ? `storage:${piece.id}`
      : piece.pieceId === "piece_fabricator"
        ? "fabricator"
        : undefined;

  if (isRoom) {
    const hatchOpenings = hatchOpeningsForRoom(piece, placed);
    return (
      <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
        <RoomShellMesh
          width={w}
          height={h}
          depth={d}
          hatchOpenings={hatchOpenings}
        />
      </group>
    );
  }

  if (isCorridor) {
    const hatchOpenings = hatchOpeningsForRoom(piece, placed);
    return (
      <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
        <CorridorShellMesh
          width={w}
          height={h}
          depth={d}
          hatchOpenings={hatchOpenings}
        />
      </group>
    );
  }

  if (isHatch) {
    return (
      <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
        <HatchMesh diameter={w} depth={d} />
      </group>
    );
  }

  if (isWindow) {
    return (
      <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
        <mesh castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color="#67e8f9"
            transparent
            opacity={0.55}
            metalness={0.2}
            roughness={0.05}
          />
        </mesh>
      </group>
    );
  }

  if (isLight) {
    const tint = showcaseColor(piece.pieceId);
    return (
      <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
        <mesh castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={tint}
            emissive={tint}
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>
    );
  }

  if (isLocker) {
    return (
      <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
        <CausticsExteriorShell width={w} height={h} depth={d} />
        <mesh castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={BUILDING_WHITE} {...BUILDING_HULL} />
        </mesh>
        <mesh position={[0, h * 0.15, d * 0.52]}>
          <boxGeometry args={[w * 0.85, h * 0.08, 0.04]} />
          <meshStandardMaterial color="#e2e2df" />
        </mesh>
        <mesh position={[0, -h * 0.35, d * 0.52]}>
          <boxGeometry args={[w * 0.7, h * 0.06, 0.04]} />
          <meshStandardMaterial
            color={LOCKER_ACCENT}
            emissive={LOCKER_ACCENT}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh
          position={[w * 0.38, 0, d * 0.52]}
          userData={
            zoneId
              ? {
                  [INTERACT_ZONE_ID_KEY]: zoneId,
                  containerDefId: def?.containerDefId,
                }
              : undefined
          }
        >
          <boxGeometry args={[0.06, h * 0.5, 0.04]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    );
  }

  if (isSolar) {
    return (
      <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
        <CausticsExteriorShell width={w} height={h} depth={d} />
        <mesh castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={BUILDING_WHITE} {...BUILDING_HULL} />
        </mesh>
      </group>
    );
  }

  if (piece.pieceId === "piece_fabricator") {
    return (
      <group
        position={piece.position}
        rotation={[0, piece.rotationY, 0]}
        userData={{ [INTERACT_ZONE_ID_KEY]: "fabricator" }}
      >
        <CausticsExteriorShell width={w} height={h} depth={d} />
        <mesh castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={BUILDING_WHITE} {...BUILDING_HULL} />
        </mesh>
      </group>
    );
  }

  const tint = showcaseColor(piece.pieceId);
  return (
    <group position={piece.position} rotation={[0, piece.rotationY, 0]}>
      <CausticsExteriorShell width={w} height={h} depth={d} />
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={tint} {...BUILDING_HULL} />
      </mesh>
    </group>
  );
}

export function PlacedPiecesLayer() {
  const placed = useGameStore((s) => s.placedPieces);

  return (
    <>
      {placed.map((p) => (
        <PieceMesh key={p.id} piece={p} placed={placed} />
      ))}
      <BuildingColliders placed={placed} />
    </>
  );
}
