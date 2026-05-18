/**
 * drei KeyboardControls map — Subnautica SN1 held keys only (WASD, Space, C, Shift).
 * @see https://wiki.subnautica.com/sn/Key_Bindings
 */
import type { HeldControlAction } from "./subnauticaBindings";
import { SN1_BINDINGS } from "./subnauticaBindings";

export type ControlAction = HeldControlAction | "holster";

type ControlEntry = { name: ControlAction; keys: string[] };

export const CONTROL_MAP: ControlEntry[] = [
  { name: "forward", keys: [...SN1_BINDINGS.moveForward.keys] },
  { name: "back", keys: [...SN1_BINDINGS.moveBackward.keys] },
  { name: "left", keys: [...SN1_BINDINGS.moveLeft.keys] },
  { name: "right", keys: [...SN1_BINDINGS.moveRight.keys] },
  { name: "moveUp", keys: [...SN1_BINDINGS.moveUp.keys] },
  { name: "moveDown", keys: [...SN1_BINDINGS.moveDown.keys] },
  { name: "sprint", keys: [...SN1_BINDINGS.sprint.keys] },
  { name: "holster", keys: [...SN1_BINDINGS.holster.keys] },
];
