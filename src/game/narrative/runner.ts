/**
 * Requirements:
 * - Invalid choice index returns null (no mutation).
 * - Advancing past a terminal node (no next, no choices) ends session.
 */

import type { GameFlags } from "../types";
import type { DialogueScript, NarrativeSession } from "./types";
import { getNode } from "./types";

export function beginDialogue(script: DialogueScript): NarrativeSession {
  return { currentNodeId: script.startId };
}

export function endDialogue(): NarrativeSession {
  return { currentNodeId: null };
}

export function getActiveNode(
  script: DialogueScript,
  session: NarrativeSession,
) {
  if (!session.currentNodeId) return null;
  return getNode(script, session.currentNodeId);
}

export function selectChoice(
  script: DialogueScript,
  session: NarrativeSession,
  choiceIndex: number,
  flags: GameFlags,
): { session: NarrativeSession; flags: GameFlags } | null {
  const node = getActiveNode(script, session);
  if (!node?.choices) return null;
  const choice = node.choices[choiceIndex];
  if (!choice) return null;
  const nextFlags: GameFlags = {
    ...flags,
    ...(choice.setFlags as GameFlags | undefined),
  };
  return {
    session: { currentNodeId: choice.nextId },
    flags: nextFlags,
  };
}

/** Continue when node has `next` and no choices (or empty choices treated as linear). */
export function advanceLinear(
  script: DialogueScript,
  session: NarrativeSession,
): NarrativeSession {
  const node = getActiveNode(script, session);
  if (!node) return session;
  if (node.choices?.length) return session;
  if (node.next) return { currentNodeId: node.next };
  return { currentNodeId: null };
}
