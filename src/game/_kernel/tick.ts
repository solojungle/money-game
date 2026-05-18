export type TickSystem = (dtMs: number) => void;

type RegisteredSystem = {
  fn: TickSystem;
  order: number;
};

const systems: RegisteredSystem[] = [];

export function registerSystem(fn: TickSystem, order: number): () => void {
  const entry: RegisteredSystem = { fn, order };
  systems.push(entry);
  systems.sort((a, b) => a.order - b.order);
  return () => {
    const i = systems.indexOf(entry);
    if (i >= 0) systems.splice(i, 1);
  };
}

export function runTick(dtMs: number): void {
  for (const { fn } of systems) {
    fn(dtMs);
  }
}

/** Test-only: remove all registered systems. */
export function clearSystems(): void {
  systems.length = 0;
}
