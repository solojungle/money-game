import {
  compassTapeMarks,
  compassTapeTranslatePx,
  formatDepthM,
} from "../../game/presentation/hud";
import { StatusBadges } from "./StatusBadges";
import "./CompassDepth.css";

const TICK_WIDTH_PX = 28;
const STRIP_CENTER_PX = 140;
const TAPE_MARKS = compassTapeMarks();

type CompassDepthProps = {
  depthM: number;
  headingDeg?: number;
};

export function CompassDepth({ depthM, headingDeg = 0 }: CompassDepthProps) {
  const depthLabel = formatDepthM(depthM);
  const translateX = compassTapeTranslatePx(
    headingDeg,
    TICK_WIDTH_PX,
    STRIP_CENTER_PX,
  );

  return (
    <div className="compass-depth" aria-label="Navigation">
      <div className="compass-depth__strip-viewport">
        <div
          className="compass-depth__strip"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {TAPE_MARKS.map((mark) => (
            <span
              key={mark.degrees}
              className={`compass-depth__tick${
                mark.emphasis ? " compass-depth__tick--cardinal" : ""
              }`}
            >
              {mark.text}
            </span>
          ))}
        </div>
      </div>

      <div className="compass-depth__depth-row">
        <svg
          className="compass-depth__bracket compass-depth__bracket--left"
          viewBox="0 0 40 8"
          aria-hidden
        >
          <path d="M 38 4 Q 20 1 2 4" fill="none" />
        </svg>
        <p className="compass-depth__depth">{depthLabel}</p>
        <svg
          className="compass-depth__bracket compass-depth__bracket--right"
          viewBox="0 0 40 8"
          aria-hidden
        >
          <path d="M 2 4 Q 20 1 38 4" fill="none" />
        </svg>
      </div>

      <StatusBadges />
    </div>
  );
}
