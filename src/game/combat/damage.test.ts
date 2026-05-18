import { describe, expect, it } from "vitest";
import { applyDamage, applyHeal } from "./damage";

describe("applyDamage", () => {
  it("clamps at zero", () => {
    expect(applyDamage(3, 10, 10)).toBe(0);
  });

  it("respects maxHp cap if current exceeded", () => {
    expect(applyDamage(12, 10, 2)).toBe(8);
  });
});

describe("applyHeal", () => {
  it("clamps at maxHp", () => {
    expect(applyHeal(9, 10, 5)).toBe(10);
  });
});
