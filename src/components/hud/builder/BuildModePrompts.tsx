import { getEquippedToolId } from "../../../game/presentation/hud/resolveInteractionPrompt";
import type { ControlBinding } from "../../../controls/inputPromptTypes";
import { useGameStore } from "../../../store/gameStore";
import { InputPrompt } from "../input/InputPrompt";
import "./builder.css";

type PromptRow = {
  label: string;
  binding: ControlBinding;
  muted?: boolean;
};

export function BuildModePrompts() {
  const started = useGameStore((s) => s.started);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const quickSlot = useGameStore((s) => s.quickSlot);
  const builderOpen = useGameStore((s) => s.builderOpen);
  const builderMode = useGameStore((s) => s.builderMode);
  const selectedId = useGameStore((s) => s.builderSelectedPieceId);
  const previewValid = useGameStore((s) => s.builderPlacementPreview?.valid);
  const snapEnabled = useGameStore((s) => s.builderSnapEnabled);

  const equipped = getEquippedToolId(hotbarSlots, quickSlot);
  if (!started || equipped !== "builder" || builderOpen) return null;

  const rows: PromptRow[] = [];

  if (builderMode === "deconstruct") {
    rows.push({ label: "DECONSTRUCT", binding: "deconstruct" });
    rows.push({ label: "REMOVE", binding: "builderPlace" });
  } else if (builderMode === "move") {
    rows.push({ label: "MOVE", binding: "builderMove" });
    rows.push({ label: "CONFIRM", binding: "builderPlace" });
    rows.push({ label: "CANCEL", binding: "stationClose" });
  } else if (selectedId) {
    rows.push({
      label: "PLACE",
      binding: "builderPlace",
      muted: !previewValid,
    });
    rows.push({ label: "ROTATE", binding: "builderRotate" });
    rows.push({
      label: snapEnabled ? "SNAPPING ON" : "SNAPPING OFF",
      binding: "builderToggleSnap",
    });
    rows.push({ label: "CANCEL", binding: "stationClose" });
  }

  rows.push({ label: "OPEN MENU", binding: "useRight" });
  rows.push({ label: "DECONSTRUCT", binding: "deconstruct" });
  rows.push({ label: "MOVE", binding: "builderMove" });

  return (
    <div className="build-mode-prompts" aria-label="Build controls">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`build-mode-prompts__item${row.muted ? " build-mode-prompts__item--muted" : ""}`}
        >
          <span>{row.label}</span>
          <InputPrompt binding={row.binding} />
        </div>
      ))}
    </div>
  );
}
