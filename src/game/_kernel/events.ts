import type { BlueprintId } from "./types";

export type BlueprintUnlockSource =
  | "SCANNER"
  | "BUILDER TOOL"
  | "DATA BOX"
  | "STORY";

export type GameEvent =
  | {
      type: "blueprint:unlocked";
      blueprintId: BlueprintId;
      displayName: string;
      source: BlueprintUnlockSource;
    }
  | {
      type: "weather:changed";
      state: import("./types").WeatherState;
      biomeId?: string;
    }
  | { type: "scan:fragment"; blueprintId: BlueprintId; state: import("./types").ScanState };

type GameEventListener = (event: GameEvent) => void;

const listeners = new Set<GameEventListener>();

export function emit(event: GameEvent): void {
  for (const listener of listeners) {
    listener(event);
  }
}

export function subscribe(listener: GameEventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Test-only: clear all subscribers. */
export function clearSubscribers(): void {
  listeners.clear();
}
