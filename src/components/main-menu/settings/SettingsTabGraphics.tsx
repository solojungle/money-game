import { useState, type ReactNode } from "react";
import { BracketFrame } from "../../hud/shared/BracketFrame";
import { PanelTitle } from "../../hud/shared/PanelTitle";
import {
  DEFAULT_GRAPHICS_SETTING,
  GRAPHICS_SETTINGS,
  type GraphicsSettingDef,
  type GraphicsSettingId,
} from "./settingsGraphics";
import "./settings.css";

function SettingRow({
  setting,
  hovered,
  onHover,
  children,
}: {
  setting: GraphicsSettingDef;
  hovered: boolean;
  onHover: (id: GraphicsSettingId) => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`settings-row${hovered ? " settings-row--hover" : ""}`}
      onMouseEnter={() => onHover(setting.id)}
      onFocusCapture={() => onHover(setting.id)}
    >
      <span className="settings-row__label">{setting.label}</span>
      <div className="settings-row__control">{children}</div>
    </div>
  );
}

export function SettingsTabGraphics() {
  const [hoveredId, setHoveredId] = useState<GraphicsSettingId>(
    DEFAULT_GRAPHICS_SETTING,
  );

  const detail =
    GRAPHICS_SETTINGS.find((s) => s.id === hoveredId) ?? GRAPHICS_SETTINGS[0];

  const displaySettings = GRAPHICS_SETTINGS.filter(
    (s) => s.section === "display",
  );
  const upscalingSettings = GRAPHICS_SETTINGS.filter(
    (s) => s.section === "upscaling",
  );

  return (
    <div className="settings-tab-graphics">
      <BracketFrame className="settings-tab-graphics__panel">
        <div className="settings-panel__body">
          <div className="settings-panel__scroll">
            <section className="settings-section">
              <PanelTitle title="Display" />
              {displaySettings.map((setting) => (
                <SettingRow
                  key={setting.id}
                  setting={setting}
                  hovered={hoveredId === setting.id}
                  onHover={setHoveredId}
                >
                  {setting.id === "resolution" ? (
                    <>
                      <div className="settings-cycle">
                        <button
                          type="button"
                          className="settings-cycle__btn"
                          aria-label="Previous resolution"
                        >
                          ‹
                        </button>
                        <span className="settings-cycle__value">1894×1066</span>
                        <button
                          type="button"
                          className="settings-cycle__btn"
                          aria-label="Next resolution"
                        >
                          ›
                        </button>
                      </div>
                      <div className="settings-stepper" aria-hidden>
                        <span className="is-active" />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    </>
                  ) : (
                    <div
                      className="settings-toggle"
                      role="group"
                      aria-label="Vertical Sync"
                    >
                      <span className="settings-toggle__option is-active">
                        Off
                      </span>
                      <span className="settings-toggle__option">On</span>
                    </div>
                  )}
                </SettingRow>
              ))}
            </section>

            <section className="settings-section">
              <PanelTitle title="Upscaling" />
              {upscalingSettings.map((setting) => (
                <SettingRow
                  key={setting.id}
                  setting={setting}
                  hovered={hoveredId === setting.id}
                  onHover={setHoveredId}
                >
                  <div className="settings-cycle">
                    <button
                      type="button"
                      className="settings-cycle__btn"
                      aria-label="Previous upscaling mode"
                    >
                      ‹
                    </button>
                    <span className="settings-cycle__value">Native</span>
                    <button
                      type="button"
                      className="settings-cycle__btn"
                      aria-label="Next upscaling mode"
                    >
                      ›
                    </button>
                  </div>
                </SettingRow>
              ))}
            </section>
          </div>
        </div>
      </BracketFrame>

      <aside className="settings-preview" aria-live="polite">
        <div className="settings-preview__grid" aria-hidden />
        <div className="settings-preview__copy">
          <h3 className="settings-preview__title">{detail.detailTitle}</h3>
          <p className="settings-preview__desc">{detail.description}</p>
        </div>
      </aside>
    </div>
  );
}
