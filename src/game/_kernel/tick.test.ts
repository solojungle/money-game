import { describe, expect, it, vi } from "vitest";
import { clearSystems, registerSystem, runTick } from "./tick";

describe("kernel tick", () => {
  it("runs systems in ascending order", () => {
    clearSystems();
    const order: number[] = [];
    registerSystem(() => order.push(30), 30);
    registerSystem(() => order.push(10), 10);
    registerSystem(() => order.push(20), 20);

    runTick(16);
    expect(order).toEqual([10, 20, 30]);
    clearSystems();
  });

  it("unregisters systems", () => {
    clearSystems();
    const fn = vi.fn();
    const unsub = registerSystem(fn, 0);
    runTick(1);
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    runTick(1);
    expect(fn).toHaveBeenCalledTimes(1);
    clearSystems();
  });
});
