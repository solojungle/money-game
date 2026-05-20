export const BUILDER_CATEGORIES = [
  { id: "standard_elements", label: "STANDARD ELEMENTS" },
  { id: "interior_facilities", label: "INTERIOR FACILITIES" },
  { id: "exterior_facilities", label: "EXTERIOR FACILITIES" },
  { id: "utility", label: "UTILITY" },
  { id: "furniture_decor", label: "FURNITURE & DECOR" },
  { id: "cultivation", label: "CULTIVATION" },
] as const;

export type BuilderCategory = (typeof BUILDER_CATEGORIES)[number]["id"];

export type BuildLocation =
  | "seabed"
  | "base_exterior"
  | "base_face"
  | "interior"
  | "interior_floor"
  | "interior_wall"
  | "interior_ceiling";

export type BuilderIngredient = {
  itemId: string;
  count: number;
};

export type BuilderPieceRecipe = {
  id: string;
  displayName: string;
  description: string;
  category: BuilderCategory;
  subsection: string;
  buildLocation: BuildLocation;
  ingredients: BuilderIngredient[];
  blueprintId: string;
  pinBlueprintId: string;
  /** Placeable mesh in world (MVP subset). */
  placeable?: boolean;
  containerDefId?: "wall_locker" | "floor_locker";
  ghostSize?: [number, number, number];
  powerDraw?: number;
  /** Subnautica 2 wiki reference (not shown in UI yet). */
  wikiUrl?: string;
};

export type PlacedPiece = {
  id: string;
  pieceId: string;
  position: [number, number, number];
  rotationY: number;
  /** Wall stack index 0–1 for wall lockers on same cell. */
  wallStack?: number;
};

export type PlacementSurface =
  | "open_water"
  | "seabed"
  | "base_exterior"
  | "base_face"
  | "interior"
  | "interior_floor"
  | "interior_wall";

export type BuilderMode = "place" | "deconstruct" | "move";
