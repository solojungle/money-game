import { ROOM_WALL_THICK } from "./buildingConstants";
import { getScaledGhostSize } from "./index";
import { resolveStructuralPlacementY } from "./structuralPlacement";
import { roomHalfExtents, snapToRoomFace, type RoomFace } from "./roomGeometry";
import type { PlacedPiece } from "./types";

/** Hub room center after layout build (set by createMegabasePlacedPieces). */
export let megabaseHubCenter: [number, number, number] = [0, 1.2, 0];

let idCounter = 0;
function pid(pieceId: string): string {
  idCounter += 1;
  return `mb_${pieceId}_${idCounter}`;
}

function structY(pieceId: string, x: number, z: number): number {
  return resolveStructuralPlacementY(pieceId, x, z);
}

function structural(
  pieceId: string,
  x: number,
  z: number,
  rotationY = 0,
): PlacedPiece {
  const y = structY(pieceId, x, z);
  return { id: pid(pieceId), pieceId, position: [x, y, z], rotationY };
}

function attachCorridor(room: PlacedPiece, face: RoomFace): PlacedPiece {
  const half = roomHalfExtents(room.pieceId);
  const attach = snapToRoomFace(room.position, half, face);
  const corrHalf = 1;
  const offset =
    (face === "+x" || face === "-x" ? half[0] : half[2]) + corrHalf;
  const step: Record<RoomFace, [number, number, number]> = {
    "+x": [1, 0, 0],
    "-x": [-1, 0, 0],
    "+z": [0, 0, 1],
    "-z": [0, 0, -1],
  };
  const s = step[face];
  return structural(
    "piece_corridor",
    attach.position[0] + s[0] * offset,
    attach.position[2] + s[2] * offset,
    attach.rotationY,
  );
}

function roomFloorY(room: PlacedPiece): number {
  const half = roomHalfExtents(room.pieceId);
  return room.position[1] - half[1] + ROOM_WALL_THICK;
}

function onFloor(
  pieceId: string,
  room: PlacedPiece,
  localX: number,
  localZ: number,
): PlacedPiece {
  const [, pieceH] = getScaledGhostSize(pieceId);
  const y = roomFloorY(room) + pieceH / 2;
  return {
    id: pid(pieceId),
    pieceId,
    position: [room.position[0] + localX, y, room.position[2] + localZ],
    rotationY: 0,
  };
}

function onInteriorWall(
  pieceId: string,
  room: PlacedPiece,
  face: RoomFace,
  along: number,
  height: number,
  pieceDepth = 0.2,
): PlacedPiece {
  const [cx, , cz] = room.position;
  const [hx, , hz] = roomHalfExtents(room.pieceId);
  const wall = ROOM_WALL_THICK;
  const halfD = pieceDepth / 2;
  let position: [number, number, number];
  let rotationY = 0;

  switch (face) {
    case "+x":
      position = [cx + hx - wall - halfD, height, cz + along];
      rotationY = Math.PI / 2;
      break;
    case "-x":
      position = [cx - hx + wall + halfD, height, cz + along];
      rotationY = -Math.PI / 2;
      break;
    case "+z":
      position = [cx + along, height, cz + hz - wall - halfD];
      rotationY = Math.PI;
      break;
    case "-z":
      position = [cx + along, height, cz - hz + wall + halfD];
      rotationY = 0;
      break;
  }

  return { id: pid(pieceId), pieceId, position, rotationY };
}

function onCeiling(
  pieceId: string,
  room: PlacedPiece,
  localX: number,
  localZ: number,
): PlacedPiece {
  const half = roomHalfExtents(room.pieceId);
  const y = room.position[1] + half[1] - ROOM_WALL_THICK - 0.08;
  return {
    id: pid(pieceId),
    pieceId,
    position: [room.position[0] + localX, y, room.position[2] + localZ],
    rotationY: 0,
  };
}

function onExteriorWall(
  pieceId: string,
  room: PlacedPiece,
  face: RoomFace,
  along: number,
  height: number,
): PlacedPiece {
  const half = roomHalfExtents(room.pieceId);
  const snap = snapToRoomFace(room.position, half, face);
  const offset: Record<RoomFace, [number, number, number]> = {
    "+x": [0.15, 0, 0],
    "-x": [-0.15, 0, 0],
    "+z": [0, 0, 0.15],
    "-z": [0, 0, -0.15],
  };
  const o = offset[face];
  return {
    id: pid(pieceId),
    pieceId,
    position: [
      snap.position[0] + o[0],
      height,
      snap.position[2] + o[2] + (face === "+x" || face === "-x" ? along : 0),
    ],
    rotationY: snap.rotationY,
  };
}

function onRoof(
  pieceId: string,
  room: PlacedPiece,
  localX: number,
  localZ: number,
): PlacedPiece {
  const half = roomHalfExtents(room.pieceId);
  const y = room.position[1] + half[1] + 0.2;
  return {
    id: pid(pieceId),
    pieceId,
    position: [room.position[0] + localX, y, room.position[2] + localZ],
    rotationY: 0,
  };
}

function onSeabed(pieceId: string, x: number, z: number): PlacedPiece {
  const y = structY(pieceId, x, z);
  return { id: pid(pieceId), pieceId, position: [x, y, z], rotationY: 0 };
}

function hatchOn(room: PlacedPiece, face: RoomFace): PlacedPiece {
  const half = roomHalfExtents(room.pieceId);
  const snap = snapToRoomFace(room.position, half, face);
  return {
    id: pid("piece_hatch"),
    pieceId: "piece_hatch",
    position: snap.position,
    rotationY: snap.rotationY,
  };
}

/**
 * Showcase base with every builder recipe placed once.
 * Replaces the old starter room at (-3, 1.2, -4).
 */
export function createMegabasePlacedPieces(): PlacedPiece[] {
  idCounter = 0;
  const pieces: PlacedPiece[] = [];

  const hub = structural("piece_room", 0, 0);
  const gallery = structural("piece_room", 9, 0);
  const decor = structural("piece_room", 0, 9);
  const halfRound = structural("piece_half_round_room", -9, 0);
  const nook = structural("piece_nook", -9, -6);
  const moonpool = structural("piece_moonpool", 0, -9);
  const foundation = structural("piece_foundation", -5, -5);

  pieces.push(
    foundation,
    hub,
    gallery,
    decor,
    halfRound,
    nook,
    moonpool,
    attachCorridor(hub, "+x"),
    attachCorridor(hub, "+z"),
    attachCorridor(hub, "-x"),
    attachCorridor(decor, "-z"),
    attachCorridor(moonpool, "+z"),
    hatchOn(hub, "+z"),
    hatchOn(gallery, "-x"),
  );

  // —— Hub interior floor ——
  pieces.push(
    onFloor("piece_fabricator", hub, -1.2, 0),
    onFloor("piece_floor_locker", hub, 1.2, -0.8),
    onFloor("piece_storage_cache", hub, 1.2, 0.8),
    onFloor("piece_growbed", hub, -1.2, 1.2),
    onFloor("piece_biobed", hub, 0, -1.2),
    onFloor("piece_vehicle_fabricator", hub, 0, 1.2),
    onFloor("piece_single_bed", decor, 0, 0),
    onFloor("piece_tailing_chest", gallery, 0, 0),
  );

  // —— Hub interior walls ——
  pieces.push(
    onInteriorWall(
      "piece_wall_locker",
      hub,
      "-x",
      0,
      hub.position[1] - 0.2,
      0.35,
    ),
    onInteriorWall("piece_interior_wall", hub, "+x", -1, hub.position[1], 0.1),
    onInteriorWall("piece_interior_arch", hub, "+x", 1, hub.position[1], 0.3),
    onInteriorWall(
      "piece_keep_calm_poster",
      decor,
      "+z",
      0,
      roomFloorY(decor) + 1.2,
      0.1,
    ),
    onInteriorWall(
      "piece_tall_axum_jar",
      decor,
      "-z",
      0.5,
      roomFloorY(decor) + 0.8,
      0.35,
    ),
  );

  // —— Interior gallery: stations + wall gear ——
  const gy = gallery.position[1];
  pieces.push(
    onFloor("piece_processor", gallery, -1.5, -1),
    onFloor("piece_biolab", gallery, 1.5, -1),
    onFloor("piece_modification_station", gallery, 0, -1.5),
    onFloor("piece_power_storage", gallery, -1.5, 1.2),
    onFloor("piece_bioreactor", gallery, 1.5, 1.2),
    onFloor("piece_noa_terminal", gallery, 0, 1.2),
    onFloor("piece_scanner_station", gallery, 0, 0),
    onInteriorWall("piece_wall_rack", gallery, "-x", -1, gy + 0.5, 0.25),
    onInteriorWall("piece_wall_light_small", gallery, "-x", 0, gy + 1.2, 0.15),
    onInteriorWall("piece_wall_light_large", gallery, "-x", 1, gy + 1.5, 0.2),
    onInteriorWall("piece_axum_wall_lamp", gallery, "+x", -1, gy + 1.4, 0.25),
    onInteriorWall("piece_battery_terminal", gallery, "+x", 0, gy + 0.6, 0.3),
    onInteriorWall(
      "piece_power_cell_terminal",
      gallery,
      "+x",
      1,
      gy + 0.6,
      0.4,
    ),
    onInteriorWall(
      "piece_time_of_day_display",
      gallery,
      "+z",
      0,
      gy + 1.3,
      0.1,
    ),
    onCeiling("piece_small_ceiling_light", gallery, -1, -1),
    onCeiling("piece_rectangular_ceiling_light", gallery, 1, 0),
    onCeiling("piece_small_ceiling_light", gallery, 0, 1),
  );

  // —— Standard openings on gallery exterior ——
  pieces.push(
    onExteriorWall("piece_window", gallery, "+z", 0, gy),
    onExteriorWall("piece_window", gallery, "+z", 1.2, gy),
    onExteriorWall("piece_interior_door", gallery, "-x", 0, gy),
    onExteriorWall("piece_ladder", hub, "-z", 0.5, gy - 0.5),
    onExteriorWall("piece_tadpole_dock", halfRound, "+x", 0, gy),
    structural("piece_pillar", -7, 5),
    structural("piece_pillar", 7, -5),
  );

  // —— Roof / exterior power & lighting ——
  pieces.push(
    onRoof("piece_solar_panel", hub, 0, 0),
    onRoof("piece_duplex_solar", hub, 1.8, 0),
    onRoof("piece_solar_panel", gallery, -1, 0),
    onRoof("piece_metal_farm", decor, 0, 1.5),
    onExteriorWall("piece_exterior_wall_light", hub, "+x", 0, gy + 0.5),
    onExteriorWall("piece_exterior_wall_light", hub, "-x", 0, gy + 0.5),
    onExteriorWall("piece_hydroelectric_turbine", gallery, "+x", 0, gy - 0.3),
    onExteriorWall("piece_thermal_plant", gallery, "+x", 1.5, gy - 0.3),
    onExteriorWall("piece_spotlight", hub, "+z", -1, gy + 1),
    onExteriorWall("piece_habitat_beacon", hub, "+z", 1, gy + 1.5),
    onRoof("piece_power_transmitter", hub, -1.5, 1.5),
  );

  // —— Utility yard (open seabed) ——
  const uy = 16;
  pieces.push(
    onSeabed("piece_portable_locker", -2, uy),
    onSeabed("piece_beacon", 0, uy),
    onSeabed("piece_portable_oxygen_generator", 2, uy),
    onSeabed("piece_work_light", -1, uy + 2),
    onSeabed("piece_dive_elevator", 1, uy + 2),
  );

  megabaseHubCenter = [...hub.position];

  return pieces;
}
