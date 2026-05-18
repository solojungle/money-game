export const SETTINGS_TABS = [
  { id: "graphics", label: "Graphics" },
  { id: "sound", label: "Sound" },
  { id: "controls", label: "Controls" },
  { id: "language", label: "Language" },
  { id: "accessibility", label: "Accessibility" },
  { id: "debug", label: "Debug / Info" },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

const ENABLED_TABS = new Set<SettingsTabId>(["graphics"]);

type SettingsTabBarProps = {
  active: SettingsTabId;
  onSelect: (id: SettingsTabId) => void;
  onCycle: (delta: -1 | 1) => void;
};

export function SettingsTabBar({
  active,
  onSelect,
  onCycle,
}: SettingsTabBarProps) {
  return (
    <nav
      className="pda-tabs settings-tabs"
      aria-label="Settings categories"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="pda-tabs__cycle"
        aria-label="Previous category"
        onClick={(e) => {
          e.stopPropagation();
          onCycle(-1);
        }}
      >
        LB
      </button>
      <ul className="pda-tabs__list">
        {SETTINGS_TABS.map((tab) => {
          const enabled = ENABLED_TABS.has(tab.id);
          return (
            <li key={tab.id}>
              <button
                type="button"
                className={`pda-tabs__tab${
                  active === tab.id ? " pda-tabs__tab--active" : ""
                }${!enabled ? " settings-tabs__tab--disabled" : ""}`}
                disabled={!enabled}
                title={!enabled ? "Coming soon" : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  if (enabled) onSelect(tab.id);
                }}
                aria-current={active === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="pda-tabs__cycle"
        aria-label="Next category"
        onClick={(e) => {
          e.stopPropagation();
          onCycle(1);
        }}
      >
        RB
      </button>
    </nav>
  );
}
