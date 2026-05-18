import { useCallback, useState } from "react";
import packageJson from "../../../package.json";
import { MainMenuButton } from "./MainMenuButton";
import { MainMenuChrome } from "./MainMenuChrome";
import { MainMenuLogo } from "./MainMenuLogo";
import { MainMenuNewsPanel } from "./MainMenuNewsPanel";
import { SettingsOverlay } from "./settings/SettingsOverlay";
import "./mainMenu.css";

export type MainMenuProps = {
  onStart: () => void;
};

const TOAST_MS = 2800;

function showStubToast(
  setToast: (msg: string | null) => void,
  message: string,
) {
  setToast(message);
  window.setTimeout(() => setToast(null), TOAST_MS);
}

export function MainMenu({ onStart }: MainMenuProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const version =
    typeof packageJson.version === "string" ? packageJson.version : "0.0.0";

  const handleImportSave = useCallback(() => {
    window.alert("No save file selected.");
  }, []);

  const handleQuit = useCallback(() => {
    window.close();
    window.setTimeout(() => {
      if (!document.hidden) {
        window.alert("Close this browser tab to quit.");
      }
    }, 200);
  }, []);

  return (
    <div className="main-menu">
      <MainMenuChrome version={version} />
      <MainMenuLogo />

      <div className="main-menu__body">
        <div className="main-menu__middle">
          <nav className="main-menu__primary" aria-label="Main menu">
            <MainMenuButton
              variant="primary"
              label="Play Single Player"
              onClick={onStart}
            />
            <MainMenuButton
              variant="primary"
              label="Host Multiplayer"
              onClick={() => showStubToast(setToast, "Multiplayer coming soon")}
            />
            <MainMenuButton
              variant="primary"
              label="Join Friends"
              onClick={() =>
                showStubToast(setToast, "Join friends coming soon")
              }
            />
          </nav>
          <MainMenuNewsPanel />
        </div>
      </div>

      <nav className="main-menu__utility" aria-label="Utility menu">
        <MainMenuButton
          variant="utility"
          label="Import Save"
          onClick={handleImportSave}
        />
        <MainMenuButton
          variant="utility"
          label="Settings"
          onClick={() => setSettingsOpen(true)}
        />
        <MainMenuButton variant="utility" label="Quit" onClick={handleQuit} />
      </nav>

      {toast && (
        <p className="main-menu__toast" role="status">
          {toast}
        </p>
      )}

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
