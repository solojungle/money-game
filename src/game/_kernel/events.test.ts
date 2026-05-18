import { describe, expect, it, vi } from "vitest";
import { clearSubscribers, emit, subscribe } from "./events";

describe("kernel events", () => {
  it("delivers events to subscribers", () => {
    clearSubscribers();
    const handler = vi.fn();
    const unsub = subscribe(handler);

    emit({
      type: "blueprint:unlocked",
      blueprintId: "seaglide",
      displayName: "SEAGLIDE",
      source: "SCANNER",
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toMatchObject({
      type: "blueprint:unlocked",
      blueprintId: "seaglide",
    });

    unsub();
    emit({
      type: "weather:changed",
      state: "storm",
    });
    expect(handler).toHaveBeenCalledTimes(1);
    clearSubscribers();
  });

  it("supports multiple subscribers", () => {
    clearSubscribers();
    const a = vi.fn();
    const b = vi.fn();
    subscribe(a);
    subscribe(b);
    emit({ type: "scan:fragment", blueprintId: "x", state: "new" });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
    clearSubscribers();
  });
});
