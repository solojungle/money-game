import type { ControlBinding } from "../../../controls/inputPromptTypes";
import { formatInteractionLabel } from "../../../game/presentation/hud/formatInteractionLabel";
import { InputPrompt } from "./InputPrompt";
import "./interaction-prompt.css";

type InteractionPromptProps = {
  label: string;
  bindings: readonly ControlBinding[];
  actionable?: boolean;
};

export function InteractionPrompt({
  label,
  bindings,
  actionable = true,
}: InteractionPromptProps) {
  const displayLabel = formatInteractionLabel(label);
  const showKeys = actionable && bindings.length > 0;
  const ariaLabel = showKeys
    ? `${displayLabel}, ${bindings.join(", ")}`
    : displayLabel;

  return (
    <div
      className={`interaction-prompt${actionable ? "" : " interaction-prompt--blocked"}`}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="interaction-prompt__label">{displayLabel}</span>
      {showKeys ? (
        <span className="interaction-prompt__paren" aria-hidden>
          <span className="interaction-prompt__paren-open">(</span>
          <span className="interaction-prompt__keys">
            {bindings.map((binding) => (
              <InputPrompt key={binding} binding={binding} />
            ))}
          </span>
          <span className="interaction-prompt__paren-close">)</span>
        </span>
      ) : null}
    </div>
  );
}
