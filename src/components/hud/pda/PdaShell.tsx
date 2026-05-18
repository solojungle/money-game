import { useGameStore } from "../../../store/gameStore";
import { PdaFooterPrompts } from "./PdaFooterPrompts";
import { PinnedRecipesRow } from "./PinnedRecipesRow";
import { PdaTabBar } from "./PdaTabBar";
import { PdaTabAdaptations } from "./PdaTabAdaptations";
import { PdaTabBlueprints } from "./PdaTabBlueprints";
import { PdaTabDatabank } from "./PdaTabDatabank";
import { PdaTabInventory } from "./PdaTabInventory";
import { PdaTabLogs } from "./PdaTabLogs";
import { PdaTabSignals } from "./PdaTabSignals";
import "../shared/station-shell.css";
import "./pda.css";

export function PdaShell() {
  const open = useGameStore((s) => s.inventoryOpen);
  const gameMode = useGameStore((s) => s.gameMode);
  const pdaTab = useGameStore((s) => s.pdaTab);
  const setInventoryOpen = useGameStore((s) => s.setInventoryOpen);

  if (!open || gameMode !== "play") {
    return null;
  }

  return (
    <div
      className="pda-shell"
      role="dialog"
      aria-modal="true"
      aria-label="PDA"
      onClick={() => setInventoryOpen(false)}
    >
      <div className="pda-shell__chrome" onClick={(e) => e.stopPropagation()}>
        <PinnedRecipesRow />
        <PdaTabBar />
        <div className="pda-shell__frame">
          <main className="pda-shell__content">
            {pdaTab === "inventory" && <PdaTabInventory />}
            {pdaTab === "blueprints" && <PdaTabBlueprints />}
            {pdaTab === "signals" && <PdaTabSignals />}
            {pdaTab === "logs" && <PdaTabLogs />}
            {pdaTab === "databank" && <PdaTabDatabank />}
            {pdaTab === "adaptations" && <PdaTabAdaptations />}
          </main>
          <PdaFooterPrompts />
        </div>
      </div>
    </div>
  );
}
