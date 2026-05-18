import { useCallback } from "react";
import {
  INVENTORY_GRID_COLS,
  INVENTORY_GRID_ROWS,
} from "../../../game/systems/inventory";
import { CONTAINER_DEFS } from "../../../game/systems/storage";
import { containerDefForPlaced } from "../../../store/builderActions";
import { useGameStore } from "../../../store/gameStore";
import { ItemGrid } from "../shared/ItemGrid";
import { StationFooter, StationFooterAction } from "../shared/StationFooter";
import "../shared/station-shell.css";
import "./storage.css";

export function StorageLockerShell() {
  const open = useGameStore((s) => s.storageOpen);
  const inventory = useGameStore((s) => s.inventory);
  const activeContainerId = useGameStore((s) => s.activeContainerId);
  const containerSlots = useGameStore((s) =>
    s.activeContainerId ? s.containers[s.activeContainerId] : null,
  );
  const storageHover = useGameStore((s) => s.storageHover);
  const storageSelected = useGameStore((s) => s.storageSelected);
  const setStorageOpen = useGameStore((s) => s.setStorageOpen);
  const storageCellClick = useGameStore((s) => s.storageCellClick);
  const setStorageHover = useGameStore((s) => s.setStorageHover);
  const placedPieces = useGameStore((s) => s.placedPieces);

  const onPlayerHover = useCallback(
    (index: number | null) =>
      setStorageHover(index === null ? null : { side: "player", index }),
    [setStorageHover],
  );
  const onContainerHover = useCallback(
    (index: number | null) =>
      setStorageHover(index === null ? null : { side: "container", index }),
    [setStorageHover],
  );

  if (!open || !activeContainerId || !containerSlots) return null;

  const defId = containerDefForPlaced(placedPieces, activeContainerId);
  const def = CONTAINER_DEFS[defId];
  const playerHover =
    storageHover?.side === "player" ? storageHover.index : null;
  const playerSelected =
    storageSelected?.side === "player" ? storageSelected.index : null;
  const containerHover =
    storageHover?.side === "container" ? storageHover.index : null;
  const containerSelected =
    storageSelected?.side === "container" ? storageSelected.index : null;

  return (
    <div
      className="station-shell storage-shell"
      role="dialog"
      aria-modal="true"
      aria-label="Storage"
      onClick={() => setStorageOpen(false)}
    >
      <div
        className="station-shell__chrome storage-shell__chrome"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="station-shell__frame">
          <main className="station-shell__content storage-shell__panels">
            <ItemGrid
              title="INVENTORY"
              cols={INVENTORY_GRID_COLS}
              rows={INVENTORY_GRID_ROWS}
              slots={inventory}
              showPlusMarkers
              bracketed
              hoveredIndex={playerHover}
              selectedIndex={playerSelected}
              onCellClick={(index) => storageCellClick("player", index)}
              onCellHover={onPlayerHover}
            />
            <ItemGrid
              title="STORAGE"
              cols={def.cols}
              rows={def.rows}
              slots={containerSlots}
              showPlusMarkers
              bracketed
              hoveredIndex={containerHover}
              selectedIndex={containerSelected}
              onCellClick={(index) => storageCellClick("container", index)}
              onCellHover={onContainerHover}
            />
          </main>

          <StationFooter>
            <StationFooterAction
              label="CLOSE"
              binding="stationClose"
              onClick={() => setStorageOpen(false)}
            />
          </StationFooter>
        </div>
      </div>
    </div>
  );
}
