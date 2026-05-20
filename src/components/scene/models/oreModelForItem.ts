export type OreModelKind = "mineral" | "crystal";

/** Maps harvestable item ids to a shared low-poly mesh variant. */
export function oreModelForItem(itemId: string): OreModelKind {
  switch (itemId) {
    case "quartz":
    case "diamond":
      return "crystal";
    default:
      return "mineral";
  }
}
