/** '+' at interior slot corners (not on outer grid edges). */
export function cellShowsPlusMarker(
  index: number,
  cols: number,
  rows: number,
): boolean {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return col < cols - 1 && row < rows - 1;
}
