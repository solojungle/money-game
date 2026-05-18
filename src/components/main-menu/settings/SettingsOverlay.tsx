import { useEffect } from "react";
import "./settings.css";

const TABS = [
  { id: "graphics", label: "Graphics", icon: "◈" },
  { id: "sound", label: "Sound", icon: "♪" },
  { id: "controls", label: "Controls", icon: "⌨" },
  { id: "language", label: "Language", icon: "Aa" },
  { id: "accessibility", label: "Accessibility", icon: "◎" },
  { id: "debug", label: "Debug / Info", icon: "⚙" },
] as const;

type SettingsOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
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
      className="settings-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <nav className="settings-panel__tabs" aria-label="Settings categories">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              className={`settings-panel__tab${i === 0 ? " settings-panel__tab--active" : ""}`}
              disabled={i !== 0}
              title={i !== 0 ? "Coming soon" : undefined}
            >
              <span className="settings-panel__tab-icon" aria-hidden>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="settings-panel__content">
          <div className="settings-panel__main">
            <section className="settings-panel__section">
              <h2 className="settings-panel__section-title">Display</h2>
              <div className="settings-panel__row">
                <span>Resolution</span>
                <div>
                  <div className="settings-panel__control">
                    <span aria-hidden>‹</span>
                    <span>1894×1066</span>
                    <span aria-hidden>›</span>
                  </div>
                  <div className="settings-panel__stepper" aria-hidden>
                    <span className="is-active" />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
              <div className="settings-panel__row">
                <span>Vertical Sync</span>
                <div
                  className="settings-panel__toggle"
                  role="group"
                  aria-label="Vertical Sync"
                >
                  <span className="is-off">Off</span>
                  <span className="is-on">On</span>
                </div>
              </div>
            </section>

            <section className="settings-panel__section">
              <h2 className="settings-panel__section-title">Upscaling</h2>
              <div className="settings-panel__row">
                <span>Upscaling Mode</span>
                <div className="settings-panel__control">
                  <span aria-hidden>‹</span>
                  <span>Native</span>
                  <span aria-hidden>›</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="settings-panel__preview" aria-hidden>
            <div className="settings-panel__preview-grid" />
          </aside>
        </div>

        <footer className="settings-panel__footer">
          <div className="settings-panel__actions">
            <div className="settings-panel__apply-wrap">
              <span className="settings-panel__apply-bar" aria-hidden />
              <button
                type="button"
                className="settings-panel__action-btn"
                onClick={onClose}
              >
                Apply
              </button>
            </div>
            <button
              type="button"
              className="settings-panel__action-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
          <div className="settings-panel__shortcuts">
            <span>
              Close <kbd>ESC</kbd>
            </span>
            <span>
              Reset All <kbd>F1</kbd>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
