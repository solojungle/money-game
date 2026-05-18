import { useCallback, useState } from "react";
import { SettingsOverlay } from "../main-menu/settings/SettingsOverlay";
import { useGameStore } from "../../store/gameStore";
import "./pauseMenu.css";

const TOAST_MS = 2800;

function showToast(setToast: (msg: string | null) => void, message: string) {
  setToast(message);
  window.setTimeout(() => setToast(null), TOAST_MS);
}

export function PauseMenu() {
  const pauseOpen = useGameStore((s) => s.pauseOpen);
  const setPauseOpen = useGameStore((s) => s.setPauseOpen);
  const saveToLocal = useGameStore((s) => s.saveToLocal);
  const quitToMainMenu = useGameStore((s) => s.quitToMainMenu);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const resume = useCallback(() => setPauseOpen(false), [setPauseOpen]);

  if (!pauseOpen) return null;

  return (
    <>
      <div
        className="pause-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Pause menu"
        onClick={resume}
      >
        <div className="pause-menu__panel" onClick={(e) => e.stopPropagation()}>
          <nav className="pause-menu__list" aria-label="Pause menu">
            <button
              type="button"
              className="pause-menu__btn"
              onClick={resume}
              autoFocus
            >
              Resume
            </button>
            <button
              type="button"
              className="pause-menu__btn"
              onClick={() => {
                saveToLocal();
                showToast(setToast, "Game saved");
              }}
            >
              Save
            </button>
            <button
              type="button"
              className="pause-menu__btn"
              onClick={() => setSettingsOpen(true)}
            >
              Options
            </button>
            <button
              type="button"
              className="pause-menu__btn"
              onClick={() => showToast(setToast, "Help coming soon")}
            >
              Help
            </button>
            <button
              type="button"
              className="pause-menu__btn"
              onClick={() => showToast(setToast, "Feedback coming soon")}
            >
              Give Feedback
            </button>
            <button
              type="button"
              className="pause-menu__btn pause-menu__btn--danger"
              onClick={quitToMainMenu}
            >
              Quit
            </button>
          </nav>
        </div>
      </div>

      {toast && (
        <p className="pause-menu__toast" role="status">
          {toast}
        </p>
      )}

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
