import { describe, expect, it } from "vitest";
import {
  advanceLinear,
  beginDialogue,
  getActiveNode,
  selectChoice,
} from "./runner";
import type { DialogueScript } from "./types";

const script: DialogueScript = {
  startId: "a",
  nodes: {
    a: { id: "a", text: "Hello", next: "b" },
    b: {
      id: "b",
      text: "Pick",
      choices: [
        { label: "Yes", nextId: "c", setFlags: { metNeighbor: true } },
        { label: "No", nextId: "d" },
      ],
    },
    c: { id: "c", text: "Ok", next: null },
    d: { id: "d", text: "Bye", next: null },
  },
};

describe("beginDialogue", () => {
  it("starts at startId", () => {
    const s = beginDialogue(script);
    expect(s.currentNodeId).toBe("a");
    expect(getActiveNode(script, s)?.text).toBe("Hello");
  });
});

describe("advanceLinear", () => {
  it("follows next when no choices", () => {
    let s = beginDialogue(script);
    s = advanceLinear(script, s);
    expect(s.currentNodeId).toBe("b");
  });

  it("does not advance when choices present", () => {
    const s = { currentNodeId: "b" as const };
    const next = advanceLinear(script, s);
    expect(next.currentNodeId).toBe("b");
  });
});

describe("selectChoice", () => {
  it("returns null for invalid index", () => {
    const s = { currentNodeId: "b" as const };
    expect(
      selectChoice(script, s, 9, {
        metNeighbor: false,
        eveningTreatUnlocked: false,
      }),
    ).toBeNull();
  });

  it("applies flag patches", () => {
    const s = { currentNodeId: "b" as const };
    const flags = {
      metNeighbor: false,
      eveningTreatUnlocked: false,
    };
    const r = selectChoice(script, s, 0, flags);
    expect(r).not.toBeNull();
    expect(r?.session.currentNodeId).toBe("c");
    expect(r?.flags.metNeighbor).toBe(true);
  });
});
