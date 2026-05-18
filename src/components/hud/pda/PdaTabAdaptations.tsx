import "./pda.css";

const ADAPTATIONS = [
  {
    id: "pressure",
    name: "Pressure Tolerance",
    unlocked: true,
    description: "Structural reinforcement for deeper dives.",
  },
  {
    id: "endurance",
    name: "Endurance",
    unlocked: false,
    description: "Locked — expand inventory capacity.",
  },
];

export function PdaTabAdaptations() {
  const unlockedCount = ADAPTATIONS.filter((a) => a.unlocked).length;

  return (
    <div className="pda-tab-list">
      <p className="pda-adaptations__progress">
        {unlockedCount} / {ADAPTATIONS.length} adaptations unlocked
      </p>
      <ul className="pda-adaptations">
        {ADAPTATIONS.map((a) => (
          <li
            key={a.id}
            className={`pda-adaptations__row${a.unlocked ? "" : " pda-adaptations__row--locked"}`}
          >
            <h3>{a.name}</h3>
            <p>{a.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
