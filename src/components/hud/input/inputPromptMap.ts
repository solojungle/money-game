import type { ControlBinding } from "../../../controls/inputPromptTypes";

const prompt = (file: string) =>
  `${import.meta.env.BASE_URL}ui/input-prompts/${file}`;

/** SVG prompts in public/ui/input-prompts (Kenney-style; replace via scripts/fetch-kenney-input-prompts.sh). */
export const INPUT_PROMPT_SRC: Record<ControlBinding, string> = {
  holster: prompt("keyboard_e.svg"),
  pda: prompt("keyboard_tab.svg"),
  /** Escape — closes station overlays (same key as PDA dismiss in usePdaKeyboard). */
  stationClose: prompt("keyboard_escape.svg"),
  /** Maps to primary interact (mouse left / future rebind). */
  fabricatorCraft: prompt("mouse_left.svg"),
  /** Maps to secondary interact (mouse right / future rebind). */
  fabricatorPin: prompt("mouse_right.svg"),
  builderPin: prompt("mouse_right.svg"),
  builderPlace: prompt("mouse_left.svg"),
  builderRotate: prompt("mouse_wheel.svg"),
  builderToggleSnap: prompt("keyboard_g.svg"),
  builderMove: prompt("keyboard_x.svg"),
  useLeft: prompt("mouse_left.svg"),
  useRight: prompt("mouse_right.svg"),
  loadTool: prompt("keyboard_f.svg"),
  reload: prompt("keyboard_r.svg"),
  deconstruct: prompt("keyboard_q.svg"),
  slot1: prompt("keyboard_1.svg"),
  slot2: prompt("keyboard_2.svg"),
  slot3: prompt("keyboard_3.svg"),
  slot4: prompt("keyboard_4.svg"),
  slot5: prompt("keyboard_5.svg"),
  slot6: prompt("keyboard_6.svg"),
  slot7: prompt("keyboard_7.svg"),
  slot8: prompt("keyboard_8.svg"),
};
