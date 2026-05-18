import type { ControlBinding } from "../../../controls/inputPromptTypes";

export type InteractionHintKind =
  | "none"
  | "scan_fragment"
  | "fabricator"
  | "storage_locker";

export type InteractionHintConfig = {
  label: string;
  bindings: readonly ControlBinding[];
};

export const INTERACTION_HINTS: Record<
  Exclude<InteractionHintKind, "none">,
  InteractionHintConfig
> = {
  scan_fragment: {
    label: "Scan fragment",
    bindings: ["useLeft"],
  },
  fabricator: {
    label: "Fabricator",
    bindings: ["holster"],
  },
  storage_locker: {
    label: "Storage locker",
    bindings: ["holster"],
  },
};

export function hintConfigForKind(
  kind: InteractionHintKind,
): InteractionHintConfig | null {
  if (kind === "none") return null;
  return INTERACTION_HINTS[kind];
}
