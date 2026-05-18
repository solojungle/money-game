import { PDA_TABS } from "../../../game/presentation/pda/pdaTypes";
import { useGameStore } from "../../../store/gameStore";
import "./pda.css";

export function PdaTabBar() {
  const pdaTab = useGameStore((s) => s.pdaTab);
  const setPdaTab = useGameStore((s) => s.setPdaTab);
  const cyclePdaTab = useGameStore((s) => s.cyclePdaTab);

  return (
    <nav
      className="pda-tabs"
      aria-label="PDA sections"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="pda-tabs__cycle"
        aria-label="Previous tab"
        onClick={(e) => {
          e.stopPropagation();
          cyclePdaTab(-1);
        }}
      >
        LB
      </button>
      <ul className="pda-tabs__list">
        {PDA_TABS.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              className={`pda-tabs__tab${
                pdaTab === tab.id ? " pda-tabs__tab--active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setPdaTab(tab.id);
              }}
              aria-current={pdaTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="pda-tabs__cycle"
        aria-label="Next tab"
        onClick={(e) => {
          e.stopPropagation();
          cyclePdaTab(1);
        }}
      >
        RB
      </button>
    </nav>
  );
}
