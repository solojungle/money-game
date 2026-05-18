import type { GameFlags } from "../types";

export type DialogueChoice = {
  label: string;
  nextId: string;
  setFlags?: Partial<GameFlags>;
};

export type DialogueNode = {
  id: string;
  text: string;
  choices?: DialogueChoice[];
  /** Linear advance (no choices); omit or null to end session */
  next?: string | null;
};

export type DialogueScript = {
  startId: string;
  nodes: Record<string, DialogueNode>;
};

export type NarrativeSession = {
  currentNodeId: string | null;
};

export function getNode(
  script: DialogueScript,
  id: string,
): DialogueNode | undefined {
  return script.nodes[id];
}
