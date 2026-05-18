import type { ControlBinding } from "../../../controls/inputPromptTypes";

/** SVG prompts in public/ui/input-prompts (Kenney-style; replace via scripts/fetch-kenney-input-prompts.sh). */
export const INPUT_PROMPT_SRC: Record<ControlBinding, string> = {
  holster: "/ui/input-prompts/keyboard_e.svg",
  pda: "/ui/input-prompts/keyboard_tab.svg",
  /** Escape — closes station overlays (same key as PDA dismiss in usePdaKeyboard). */
  stationClose: "/ui/input-prompts/keyboard_escape.svg",
  /** Maps to primary interact (mouse left / future rebind). */
  fabricatorCraft: "/ui/input-prompts/mouse_left.svg",
  /** Maps to secondary interact (mouse right / future rebind). */
  fabricatorPin: "/ui/input-prompts/mouse_right.svg",
  builderPin: "/ui/input-prompts/mouse_right.svg",
  builderPlace: "/ui/input-prompts/mouse_left.svg",
  builderRotate: "/ui/input-prompts/mouse_wheel.svg",
  builderToggleSnap: "/ui/input-prompts/keyboard_g.svg",
  builderMove: "/ui/input-prompts/keyboard_x.svg",
  useLeft: "/ui/input-prompts/mouse_left.svg",
  useRight: "/ui/input-prompts/mouse_right.svg",
  loadTool: "/ui/input-prompts/keyboard_f.svg",
  reload: "/ui/input-prompts/keyboard_r.svg",
  deconstruct: "/ui/input-prompts/keyboard_q.svg",
  slot1: "/ui/input-prompts/keyboard_1.svg",
  slot2: "/ui/input-prompts/keyboard_2.svg",
  slot3: "/ui/input-prompts/keyboard_3.svg",
  slot4: "/ui/input-prompts/keyboard_4.svg",
  slot5: "/ui/input-prompts/keyboard_5.svg",
  slot6: "/ui/input-prompts/keyboard_6.svg",
  slot7: "/ui/input-prompts/keyboard_7.svg",
  slot8: "/ui/input-prompts/keyboard_8.svg",
};
