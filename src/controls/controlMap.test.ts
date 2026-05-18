import { describe, expect, it } from "vitest";
import { CONTROL_MAP } from "./controlMap";
import { SN1_BINDINGS } from "./subnauticaBindings";

function keysFor(name: string): string[] {
  const entry = CONTROL_MAP.find((e) => e.name === name);
  expect(entry).toBeDefined();
  return entry!.keys;
}

describe("CONTROL_MAP matches Subnautica SN1 defaults", () => {
  it("maps movement to WASD only", () => {
    expect(keysFor("forward")).toEqual([...SN1_BINDINGS.moveForward.keys]);
    expect(keysFor("back")).toEqual([...SN1_BINDINGS.moveBackward.keys]);
    expect(keysFor("left")).toEqual([...SN1_BINDINGS.moveLeft.keys]);
    expect(keysFor("right")).toEqual([...SN1_BINDINGS.moveRight.keys]);
  });

  it("maps vertical swim to Space and C only", () => {
    expect(keysFor("moveUp")).toEqual(["Space"]);
    expect(keysFor("moveDown")).toEqual(["KeyC"]);
    expect(keysFor("moveUp")).not.toContain("ControlLeft");
  });

  it("maps sprint to left shift only", () => {
    expect(keysFor("sprint")).toEqual(["ShiftLeft"]);
  });

  it("maps holster/interact to E", () => {
    expect(keysFor("holster")).toEqual(["KeyE"]);
  });

  it("does not include arrow keys or I for inventory", () => {
    const allKeys = CONTROL_MAP.flatMap((e) => e.keys);
    expect(allKeys).not.toContain("ArrowUp");
    expect(allKeys).not.toContain("ArrowDown");
    expect(allKeys).not.toContain("ArrowLeft");
    expect(allKeys).not.toContain("ArrowRight");
    expect(allKeys).not.toContain("KeyI");
    expect(allKeys).not.toContain("ControlLeft");
    expect(allKeys).not.toContain("ControlRight");
    expect(allKeys).not.toContain("KeyF");
  });
});
