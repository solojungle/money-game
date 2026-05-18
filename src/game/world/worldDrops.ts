export type WorldDrop = {
  id: string;
  itemId: string;
  count: number;
  position: [number, number, number];
};

export function zoneIdForWorldDrop(dropId: string): string {
  return `drop:${dropId}`;
}

export function parseWorldDropZoneId(
  zoneId: string,
): { dropId: string } | null {
  const m = /^drop:(.+)$/.exec(zoneId);
  if (!m) return null;
  return { dropId: m[1] };
}

export function scatterOffset(index: number): [number, number, number] {
  const angle = index * 2.399963;
  const r = 0.25 + (index % 3) * 0.15;
  return [Math.cos(angle) * r, 0.12, Math.sin(angle) * r];
}
