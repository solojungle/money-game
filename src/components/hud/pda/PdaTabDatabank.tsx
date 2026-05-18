import { useState } from "react";
import "./pda.css";

const ENTRIES = [
  {
    id: "start",
    category: "Survival",
    title: "Start Here",
    body: "Your PDA has rebooted in Emergency Mode. Monitor vitals, gather materials, and fabricate essential equipment.",
  },
  {
    id: "checklist",
    category: "Survival",
    title: "Survival Checklist",
    body: "Survey the environment, construct survival equipment, and broadcast a distress signal from the lifepod.",
  },
];

export function PdaTabDatabank() {
  const [selectedId, setSelectedId] = useState(ENTRIES[0]?.id ?? "");

  const selected = ENTRIES.find((e) => e.id === selectedId);

  return (
    <div className="pda-databank">
      <ul className="pda-databank__list">
        {ENTRIES.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className={`pda-databank__item${
                entry.id === selectedId ? " pda-databank__item--active" : ""
              }`}
              onClick={() => setSelectedId(entry.id)}
            >
              <span className="pda-databank__cat">{entry.category}</span>
              {entry.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="pda-databank__detail">
        {selected ? (
          <>
            <h3>{selected.title}</h3>
            <p>{selected.body}</p>
          </>
        ) : (
          <p className="pda-tab-list__empty">Select an entry.</p>
        )}
      </div>
    </div>
  );
}
