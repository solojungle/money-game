/**
 * Subnautica default QWERTY PC bindings.
 * @see https://wiki.subnautica.com/sn/Key_Bindings
 */
export const SN1_BINDINGS = {
  jump: { label: "Jump", keys: ["Space"] as const },
  pda: { label: "PDA", keys: ["Tab", "KeyI"] as const },
  deconstruct: { label: "Deconstruct", keys: ["KeyQ"] as const },
  holster: { label: "Exit / Holster", keys: ["KeyE"] as const },
  useLeft: { label: "Left hand / Use", buttons: [0] as const },
  useRight: { label: "Right hand", buttons: [2] as const },
  nextItem: { label: "Next item", wheel: "up" as const },
  prevItem: { label: "Previous item", wheel: "down" as const },
  slot1: { label: "Slot 1", keys: ["Digit1"] as const },
  slot2: { label: "Slot 2", keys: ["Digit2"] as const },
  slot3: { label: "Slot 3", keys: ["Digit3"] as const },
  slot4: { label: "Slot 4", keys: ["Digit4"] as const },
  slot5: { label: "Slot 5", keys: ["Digit5"] as const },
  slot6: { label: "Slot 6", keys: ["Digit6"] as const },
  slot7: { label: "Slot 7", keys: ["Digit7"] as const },
  slot8: { label: "Slot 8", keys: ["Digit8"] as const },
  loadTool: { label: "Load Tool", keys: ["KeyF"] as const },
  rotateLeft: { label: "Rotate item left", keys: ["KeyQ"] as const },
  rotateRight: { label: "Rotate item right", keys: ["KeyE"] as const },
  takePicture: { label: "Take picture", keys: ["F11"] as const },
  reload: { label: "Reload", keys: ["KeyR"] as const },
  sprint: { label: "Sprint", keys: ["ShiftLeft"] as const },
  moveUp: { label: "Move up", keys: ["Space"] as const },
  moveDown: { label: "Move down", keys: ["KeyC"] as const },
  moveForward: { label: "Move forward", keys: ["KeyW"] as const },
  moveBackward: { label: "Move backward", keys: ["KeyS"] as const },
  moveLeft: { label: "Move left", keys: ["KeyA"] as const },
  moveRight: { label: "Move right", keys: ["KeyD"] as const },
  debugInfo: { label: "Debug information menu", keys: ["F1"] as const },
  debugGraphics: { label: "Debug graphics menu", keys: ["F3"] as const },
  hideUi: { label: "Hide/Show interface", keys: ["F6"] as const },
  feedback: { label: "Feedback menu", keys: ["F8"] as const },
} as const;

/** Keys held continuously via @react-three/drei KeyboardControls. */
export type HeldControlAction =
  | "forward"
  | "back"
  | "left"
  | "right"
  | "moveUp"
  | "moveDown"
  | "sprint";

/** Edge-triggered keyboard actions handled outside KeyboardControls. */
export type EdgeControlAction =
  | "pda"
  | "holster"
  | "deconstruct"
  | "loadTool"
  | "reload"
  | "slot1"
  | "slot2"
  | "slot3"
  | "slot4"
  | "slot5"
  | "slot6"
  | "slot7"
  | "slot8";

export type MouseControlAction = "useLeft" | "useRight";

export type WheelControlAction = "nextItem" | "prevItem";

export function edgeActionFromKeyboard(code: string): EdgeControlAction | null {
  switch (code) {
    case "Tab":
    case "KeyI":
      return "pda";
    case "KeyE":
      return "holster";
    case "KeyQ":
      return "deconstruct";
    case "KeyF":
      return "loadTool";
    case "KeyR":
      return "reload";
    case "Digit1":
      return "slot1";
    case "Digit2":
      return "slot2";
    case "Digit3":
      return "slot3";
    case "Digit4":
      return "slot4";
    case "Digit5":
      return "slot5";
    case "Digit6":
      return "slot6";
    case "Digit7":
      return "slot7";
    case "Digit8":
      return "slot8";
    default:
      return null;
  }
}

export function mouseActionFromButton(
  button: number,
): MouseControlAction | null {
  if (button === 0) return "useLeft";
  if (button === 2) return "useRight";
  return null;
}
