import { describe, expect, it } from "vitest";
import { createAudioService, createSilentAudioService } from "./audioService";

describe("createSilentAudioService", () => {
  it("no-ops without throwing", () => {
    const a = createSilentAudioService();
    expect(() => a.playOneShot("pickup")).not.toThrow();
    expect(() => a.dispose()).not.toThrow();
  });
});

describe("createAudioService", () => {
  it("does not throw when no URLs are configured", () => {
    const a = createAudioService();
    expect(() => a.playOneShot("ui_confirm")).not.toThrow();
    expect(() => a.dispose()).not.toThrow();
  });
});
