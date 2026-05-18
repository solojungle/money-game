import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { ROOM_WALL_THICK } from "../../../game/building/buildingConstants";
import {
  getPiece,
  getScaledGhostSize,
  structuralPieceIds,
} from "../../../game/building";
import type { PlacedPiece } from "../../../game/building";
import { hatchesOnRoomFaces } from "../../../game/building/roomHatchOpenings";
import {
  ROOM_PIECE_IDS,
  roomHalfExtents,
} from "../../../game/building/roomGeometry";

function roomWallSpecs(
  half: [number, number, number],
  openFaces: Set<import("../../../game/building/roomGeometry").RoomFace>,
): {
  position: [number, number, number];
  halfExtents: [number, number, number];
}[] {
  const [hx, hy, hz] = half;
  const t = ROOM_WALL_THICK;
  const walls: {
    position: [number, number, number];
    halfExtents: [number, number, number];
  }[] = [];

  walls.push({
    position: [0, -hy + t / 2, 0],
    halfExtents: [hx, t / 2, hz],
  });
  walls.push({
    position: [0, hy - t / 2, 0],
    halfExtents: [hx, t / 2, hz],
  });

  if (!openFaces.has("-x")) {
    walls.push({
      position: [-hx + t / 2, 0, 0],
      halfExtents: [t / 2, hy, hz],
    });
  }
  if (!openFaces.has("+x")) {
    walls.push({
      position: [hx - t / 2, 0, 0],
      halfExtents: [t / 2, hy, hz],
    });
  }
  if (!openFaces.has("-z")) {
    walls.push({
      position: [0, 0, -hz + t / 2],
      halfExtents: [hx, hy, t / 2],
    });
  }
  if (!openFaces.has("+z")) {
    walls.push({
      position: [0, 0, hz - t / 2],
      halfExtents: [hx, hy, t / 2],
    });
  }

  return walls;
}

function SolidPieceCollider({ piece }: { piece: PlacedPiece }) {
  const [w, h, d] = getScaledGhostSize(piece.pieceId);

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={piece.position}
      rotation={[0, piece.rotationY, 0]}
    >
      <CuboidCollider args={[w / 2, h / 2, d / 2]} />
    </RigidBody>
  );
}

function RoomShellCollider({
  piece,
  placed,
}: {
  piece: PlacedPiece;
  placed: PlacedPiece[];
}) {
  const half = roomHalfExtents(piece.pieceId);
  const walls = useMemo(() => {
    const openFaces = hatchesOnRoomFaces(piece, half, placed);
    return roomWallSpecs(half, openFaces);
  }, [piece, half, placed]);

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={piece.position}
      rotation={[0, piece.rotationY, 0]}
    >
      {walls.map((wall, i) => (
        <CuboidCollider
          key={i}
          args={wall.halfExtents}
          position={wall.position}
        />
      ))}
    </RigidBody>
  );
}

export function BuildingColliders({ placed }: { placed: PlacedPiece[] }) {
  const structural = useMemo(() => new Set(structuralPieceIds()), []);

  return (
    <>
      {placed.map((piece) => {
        if (piece.pieceId === "piece_hatch") {
          return null;
        }

        if (
          ROOM_PIECE_IDS.includes(
            piece.pieceId as (typeof ROOM_PIECE_IDS)[number],
          )
        ) {
          return (
            <RoomShellCollider
              key={`col-${piece.id}`}
              piece={piece}
              placed={placed}
            />
          );
        }

        const def = getPiece(piece.pieceId);
        if (!def?.placeable) return null;

        if (
          structural.has(piece.pieceId) ||
          piece.pieceId === "piece_fabricator" ||
          piece.pieceId.includes("locker") ||
          piece.pieceId.includes("solar")
        ) {
          return <SolidPieceCollider key={`col-${piece.id}`} piece={piece} />;
        }

        return null;
      })}
    </>
  );
}
