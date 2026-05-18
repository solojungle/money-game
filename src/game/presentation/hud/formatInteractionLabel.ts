/** Sentence-style casing: first character upper, rest unchanged. */
export function formatInteractionLabel(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
