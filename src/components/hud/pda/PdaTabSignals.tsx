import "./pda.css";

const STUB_SIGNALS = [
  { id: "lifepod", name: "LIFEPOD", enabled: true, color: "#00d4ff" },
];

export function PdaTabSignals() {
  return (
    <div className="pda-tab-list">
      <p className="pda-tab-list__hint">
        Toggle signals to show navigation markers in the world.
      </p>
      <ul className="pda-signals">
        {STUB_SIGNALS.map((sig) => (
          <li key={sig.id} className="pda-signals__row">
            <span
              className="pda-signals__dot"
              style={{ background: sig.color }}
              aria-hidden
            />
            <span className="pda-signals__name">{sig.name}</span>
            <label className="pda-signals__toggle">
              <input type="checkbox" defaultChecked={sig.enabled} />
              <span>{sig.enabled ? "ON" : "OFF"}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
