import { useEffect, useRef, useState } from "react";
import { formatO2Percent } from "../../game/presentation/hud";
import healthIcon from "../../assets/hud/vitals/health.svg";
import hungerIcon from "../../assets/hud/vitals/hunger.svg";
import waterIcon from "../../assets/hud/vitals/water.svg";
import "./VitalsCluster.css";

type VitalsClusterProps = {
  o2Percent: number;
  healthPercent?: number;
  hungerPercent?: number;
  thirstPercent?: number;
  nearDeath?: boolean;
  /** SN2: show numeric values when PDA is open */
  numericMode?: boolean;
};

const MINI_R = 14;
const MINI_CIRC = 2 * Math.PI * MINI_R;
const O2_BUBBLE_COUNT = 5;

const O2_RING_CX = 40;
const O2_RING_CY = 40;
const O2_RING_R = 34;
const O2_RING_CIRC = 2 * Math.PI * O2_RING_R;
/** Full ring from 12 o'clock (sweep 1). */
const O2_RING_PATH = `M ${O2_RING_CX} ${O2_RING_CY - O2_RING_R} A ${O2_RING_R} ${O2_RING_R} 0 1 1 ${O2_RING_CX - 0.01} ${O2_RING_CY - O2_RING_R}`;
/** Mirror so dashoffset gap opens clockwise (upper right first). */
const O2_RING_FLIP = `translate(${O2_RING_CX} ${O2_RING_CY}) scale(-1 1) translate(${-O2_RING_CX} ${-O2_RING_CY})`;

/** Gap opens clockwise from 12 o'clock as O₂ drops. */
function o2RingStroke(o2Percent: number): {
  strokeDasharray: string;
  strokeDashoffset: number;
} {
  const pct = Math.max(0, Math.min(100, o2Percent));
  return {
    strokeDasharray: `${O2_RING_CIRC}`,
    strokeDashoffset: O2_RING_CIRC * (1 - pct / 100),
  };
}

/** Equal 35° steps on left arc (10 / 9 / 8 o'clock). */
const ORBIT_ANGLES = {
  health: 215,
  hunger: 180,
  thirst: 145,
} as const;

function MiniOrb({
  value,
  rim,
  orbitAngle,
  iconSrc,
}: {
  value: number;
  rim: string;
  orbitAngle: number;
  iconSrc: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="vitals-cluster__mini"
      style={{
        ["--orb-rim" as string]: rim,
        ["--orbit-angle" as string]: `${orbitAngle}deg`,
      }}
    >
      <svg
        className="vitals-cluster__mini-ring"
        viewBox="0 0 36 36"
        aria-hidden
      >
        <circle
          className="vitals-cluster__mini-track"
          cx="18"
          cy="18"
          r={MINI_R}
          fill="none"
        />
        <g transform="translate(18 18) scale(-1 1) translate(-18 -18)">
          <circle
            className="vitals-cluster__mini-fill"
            cx="18"
            cy="18"
            r={MINI_R}
            fill="none"
            strokeDasharray={`${MINI_CIRC}`}
            strokeDashoffset={MINI_CIRC * (1 - pct / 100)}
            transform="rotate(-90 18 18)"
          />
        </g>
      </svg>
      <span className="vitals-cluster__mini-icon">
        <img src={iconSrc} alt="" className="vitals-cluster__mini-icon-img" />
      </span>
    </div>
  );
}

function O2Bubbles() {
  return (
    <div className="vitals-cluster__o2-bubbles" aria-hidden>
      {Array.from({ length: O2_BUBBLE_COUNT }, (_, i) => (
        <span
          key={i}
          className="vitals-cluster__o2-bubble"
          style={{ ["--bubble-i" as string]: i }}
        />
      ))}
    </div>
  );
}

export function VitalsCluster({
  o2Percent,
  healthPercent = 100,
  hungerPercent = 85,
  thirstPercent = 90,
  nearDeath = false,
  numericMode = false,
}: VitalsClusterProps) {
  const o2Stroke = o2RingStroke(o2Percent);
  const o2Text = formatO2Percent(o2Percent);
  const prevO2 = useRef(o2Percent);
  const [refilling, setRefilling] = useState(false);

  useEffect(() => {
    if (o2Percent > prevO2.current + 0.05) {
      // Brief refill VFX when O₂ increases (e.g. surfacing)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot UI pulse
      setRefilling(true);
      const timer = window.setTimeout(() => setRefilling(false), 1200);
      prevO2.current = o2Percent;
      return () => window.clearTimeout(timer);
    }
    prevO2.current = o2Percent;
  }, [o2Percent]);

  return (
    <div
      className={`vitals-cluster${nearDeath ? " vitals-cluster--near-death" : ""}${
        refilling ? " vitals-cluster--refilling" : ""
      }${numericMode ? " vitals-cluster--numeric" : ""}`}
      aria-label="Vitals"
    >
      <div className="vitals-cluster__o2">
        <svg
          className="vitals-cluster__o2-ring"
          viewBox="0 0 80 80"
          aria-hidden
        >
          <circle
            className="vitals-cluster__o2-track"
            cx={O2_RING_CX}
            cy={O2_RING_CY}
            r={O2_RING_R}
            fill="none"
          />
          <g transform={O2_RING_FLIP}>
            <path
              className="vitals-cluster__o2-fill"
              d={O2_RING_PATH}
              fill="none"
              strokeDasharray={o2Stroke.strokeDasharray}
              strokeDashoffset={o2Stroke.strokeDashoffset}
            />
          </g>
        </svg>
        {refilling ? <O2Bubbles /> : null}
        <div className="vitals-cluster__o2-center">
          <span className="vitals-cluster__o2-label">O₂</span>
          <span className="vitals-cluster__o2-value">{o2Text}</span>
        </div>
      </div>

      <MiniOrb
        value={healthPercent}
        rim="#4ade80"
        orbitAngle={ORBIT_ANGLES.health}
        iconSrc={healthIcon}
      />
      {numericMode ? (
        <span className="vitals-cluster__stat-num vitals-cluster__stat-num--health">
          {Math.round(healthPercent)}
        </span>
      ) : null}
      <MiniOrb
        value={hungerPercent}
        rim="#fbbf24"
        orbitAngle={ORBIT_ANGLES.hunger}
        iconSrc={hungerIcon}
      />
      {numericMode ? (
        <span className="vitals-cluster__stat-num vitals-cluster__stat-num--food">
          {Math.round(hungerPercent)}
        </span>
      ) : null}
      <MiniOrb
        value={thirstPercent}
        rim="#60a5fa"
        orbitAngle={ORBIT_ANGLES.thirst}
        iconSrc={waterIcon}
      />
    </div>
  );
}
