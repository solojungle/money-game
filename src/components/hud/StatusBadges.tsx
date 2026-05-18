import "./StatusBadges.css";

export function StatusBadges() {
  return (
    <div className="status-badges" aria-hidden>
      <span className="status-badges__badge status-badges__badge--power">
        <svg viewBox="0 0 24 24" className="status-badges__icon">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" />
        </svg>
      </span>
      <span className="status-badges__badge status-badges__badge--temp">
        <svg viewBox="0 0 24 24" className="status-badges__icon">
          <path
            d="M12 2c-1.1 0-2 .9-2 2v9.5C8.4 14.9 7 16.7 7 19c0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.3-1.4-4.1-3-5.5V4c0-1.1-.9-2-2-2zm0 18c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
}
