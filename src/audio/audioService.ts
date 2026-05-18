import { Howl } from "howler";

/**
 * Small wrapper so gameplay code and tests do not touch Howler directly.
 */
export type AudioService = {
  playOneShot(id: "ui_confirm" | "pickup" | "switch_form"): void;
  dispose(): void;
};

const URLS: Record<string, string> = {
  // Short generated-like blips via data URIs are brittle; use silent no-op until assets exist.
  ui_confirm: "",
  pickup: "",
  switch_form: "",
};

export function createAudioService(): AudioService {
  const howls: Record<string, Howl> = {};

  function getHowl(id: string): Howl | null {
    const url = URLS[id];
    if (!url) return null;
    if (!howls[id]) {
      howls[id] = new Howl({ src: [url], volume: 0.35 });
    }
    return howls[id];
  }

  return {
    playOneShot(id) {
      const h = getHowl(id);
      h?.play();
    },
    dispose() {
      for (const h of Object.values(howls)) {
        h.unload();
      }
    },
  };
}

export function createSilentAudioService(): AudioService {
  return {
    playOneShot() {},
    dispose() {},
  };
}
