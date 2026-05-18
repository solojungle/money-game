import "./pda.css";

const STUB_LOGS = [
  {
    id: "boot",
    title: "PDA REBOOTED",
    body: "Emergency mode active. Keep you alive on an alien world.",
  },
];

export function PdaTabLogs() {
  return (
    <div className="pda-tab-list">
      <ul className="pda-logs">
        {STUB_LOGS.map((log) => (
          <li key={log.id} className="pda-logs__entry">
            <h3 className="pda-logs__title">{log.title}</h3>
            <p className="pda-logs__body">{log.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
