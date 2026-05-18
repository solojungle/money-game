import { resolveItemTooltip } from "../../../game/presentation/pda/resolveItemTooltip";
import { InputPrompt } from "../input/InputPrompt";
import "./pda.css";

type ItemTooltipProps = {
  itemId: string;
  className?: string;
};

export function ItemTooltip({ itemId, className = "" }: ItemTooltipProps) {
  const info = resolveItemTooltip(itemId);
  if (!info) return null;

  return (
    <div className={`pda-tooltip ${className}`.trim()} role="tooltip">
      <p className="pda-tooltip__name">{info.displayName}</p>
      <p className="pda-tooltip__desc">{info.description}</p>
      {(info.food != null ||
        info.water != null ||
        info.battery != null ||
        info.health != null) && (
        <ul className="pda-tooltip__stats">
          {info.food != null ? <li>Food +{info.food}</li> : null}
          {info.water != null ? <li>Water +{info.water}</li> : null}
          {info.health != null ? <li>Health +{info.health}</li> : null}
          {info.battery != null ? <li>Battery {info.battery}%</li> : null}
        </ul>
      )}
      {info.actions.length > 0 ? (
        <ul className="pda-tooltip__actions">
          {info.actions.map((row) => (
            <li key={row.action}>
              {row.bindings.map((b) => (
                <InputPrompt key={b} binding={b} className="pda-tooltip__key" />
              ))}
              <span>{row.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
