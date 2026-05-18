import { useCallback, useEffect, useState } from "react";
import {
  StationFooter,
  StationFooterAction,
} from "../../hud/shared/StationFooter";
import "../../hud/pda/pda.css";
import "../../hud/shared/station-shell.css";
import {
  SettingsTabBar,
  SETTINGS_TABS,
  type SettingsTabId,
} from "./SettingsTabBar";
import { SettingsTabGraphics } from "./SettingsTabGraphics";
import "./settings.css";

type SettingsOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const TAB_IDS = SETTINGS_TABS.map((t) => t.id);

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const [tab, setTab] = useState<SettingsTabId>("graphics");

  const cycleTab = useCallback((delta: -1 | 1) => {
    setTab((current) => {
      const idx = TAB_IDS.indexOf(current);
      const next = (idx + delta + TAB_IDS.length) % TAB_IDS.length;
      return TAB_IDS[next] ?? "graphics";
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="pda-shell settings-shell"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      onClick={onClose}
    >
      <div className="pda-shell__chrome" onClick={(e) => e.stopPropagation()}>
        <SettingsTabBar active={tab} onSelect={setTab} onCycle={cycleTab} />

        <div className="pda-shell__frame">
          <main className="pda-shell__content settings-shell__content">
            {tab === "graphics" ? (
              <SettingsTabGraphics />
            ) : (
              <p className="pda-tab-list__empty settings-shell__placeholder">
                Coming soon
              </p>
            )}
          </main>

          <StationFooter>
            <StationFooterAction
              label="APPLY"
              binding="useLeft"
              onClick={onClose}
            />
            <StationFooterAction
              label="CANCEL"
              binding="stationClose"
              onClick={onClose}
            />
            <StationFooterAction label="RESET ALL" binding="reload" muted />
          </StationFooter>
        </div>
      </div>
    </div>
  );
}
