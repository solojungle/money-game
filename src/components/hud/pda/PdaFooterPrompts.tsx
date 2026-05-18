import type { ControlBinding } from "../../../controls/inputPromptTypes";
import { useGameStore } from "../../../store/gameStore";
import { StationFooter, StationFooterAction } from "../shared/StationFooter";

const SLOT_BINDINGS: ControlBinding[] = [
  "slot1",
  "slot2",
  "slot3",
  "slot4",
  "slot5",
];

export function PdaFooterPrompts() {
  const setInventoryOpen = useGameStore((s) => s.setInventoryOpen);
  const pdaAssignHotbarIndex = useGameStore((s) => s.pdaAssignHotbarIndex);
  const slotBinding =
    SLOT_BINDINGS[pdaAssignHotbarIndex] ?? ("slot1" as ControlBinding);

  return (
    <StationFooter>
      <StationFooterAction
        label="CLOSE"
        binding="pda"
        onClick={() => setInventoryOpen(false)}
      />
      <StationFooterAction label="CHANGE SLOT" binding={slotBinding} muted />
      <StationFooterAction label="USE / EQUIP" binding="useLeft" muted />
      <StationFooterAction label="DROP / PIN" binding="useRight" muted />
    </StationFooter>
  );
}
