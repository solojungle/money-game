import { getScaledGhostSize } from "../../game/building";
import { useGameStore } from "../../store/gameStore";
import { HatchMesh } from "./building/HatchMesh";
import { CorridorShellMesh } from "./building/CorridorShellMesh";
import { RoomShellMesh } from "./building/RoomShellMesh";

export function PlacementGhost() {
  const preview = useGameStore((s) => s.builderPlacementPreview);
  const selectedId = useGameStore((s) => s.builderSelectedPieceId);
  const builderOpen = useGameStore((s) => s.builderOpen);

  if (builderOpen || !selectedId || !preview) return null;

  const [w, h, d] = getScaledGhostSize(selectedId);
  const size: [number, number, number] = [w, h, d];
  const color = preview.valid ? "#4ade80" : "#f87171";

  if (selectedId === "piece_hatch") {
    return (
      <group position={preview.position} rotation={[0, preview.rotationY, 0]}>
        <HatchMesh
          diameter={w}
          depth={d}
          ghostColor={color}
          ghostOpacity={0.5}
        />
      </group>
    );
  }

  if (selectedId === "piece_room" || selectedId === "piece_half_round_room") {
    return (
      <group position={preview.position} rotation={[0, preview.rotationY, 0]}>
        <RoomShellMesh width={w} height={h} depth={d} hatchOpenings={[]} />
        <mesh>
          <boxGeometry args={[w, h, d]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  }

  if (selectedId === "piece_corridor") {
    return (
      <group position={preview.position} rotation={[0, preview.rotationY, 0]}>
        <CorridorShellMesh
          width={w}
          height={h}
          depth={d}
          ghostColor={color}
          ghostOpacity={0.45}
        />
      </group>
    );
  }

  return (
    <mesh position={preview.position} rotation={[0, preview.rotationY, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </mesh>
  );
}
