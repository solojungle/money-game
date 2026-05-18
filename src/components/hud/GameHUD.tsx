import { useMemo } from "react";
import {
  getEquippedToolId,
  resolveInteractionPrompt,
} from "../../game/presentation/hud/resolveInteractionPrompt";
import { useGameStore } from "../../store/gameStore";
import { BlueprintToastStack } from "./BlueprintToast";
import { PickupFloatStack } from "./PickupFloat";
import { CompassDepth } from "./CompassDepth";
import { CompassNeedle } from "./CompassNeedle";
import { Hotbar } from "./Hotbar";
import { HudReticle } from "./HudReticle";
import { InteractionPrompt } from "./input/InteractionPrompt";
import { VitalsCluster } from "./VitalsCluster";

export function GameHUD() {
  const started = useGameStore((s) => s.started);
  const o2Percent = useGameStore((s) => s.o2Percent);
  const depthM = useGameStore((s) => s.depthM);
  const headingDeg = useGameStore((s) => s.headingDeg);
  const healthPercent = useGameStore((s) => s.healthPercent);
  const hungerPercent = useGameStore((s) => s.hungerPercent);
  const thirstPercent = useGameStore((s) => s.thirstPercent);
  const activeInteractable = useGameStore((s) => s.activeInteractable);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const quickSlot = useGameStore((s) => s.quickSlot);
  const nearDeath = useGameStore((s) => s.nearDeath);
  const inventoryOpen = useGameStore((s) => s.inventoryOpen);

  const prompt = useMemo(() => {
    const equipped = getEquippedToolId(hotbarSlots, quickSlot);
    return resolveInteractionPrompt(activeInteractable, equipped);
  }, [activeInteractable, hotbarSlots, quickSlot]);

  if (!started) return null;

  return (
    <>
      <BlueprintToastStack />
      <PickupFloatStack />
      <div className="game-hud">
        <HudReticle />

        <div className="game-hud__cluster game-hud__cluster--bl">
          <VitalsCluster
            o2Percent={o2Percent}
            healthPercent={healthPercent}
            hungerPercent={hungerPercent}
            thirstPercent={thirstPercent}
            nearDeath={nearDeath()}
            numericMode={inventoryOpen}
          />
        </div>

        <div className="game-hud__cluster game-hud__cluster--tc">
          <CompassNeedle />
          <CompassDepth depthM={depthM} headingDeg={headingDeg} />
        </div>

        <div className="game-hud__cluster game-hud__cluster--bc">
          <Hotbar />
        </div>

        {prompt ? (
          <div className="game-hud__prompt">
            <InteractionPrompt
              label={prompt.label}
              bindings={prompt.bindings}
              actionable={prompt.actionable}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
