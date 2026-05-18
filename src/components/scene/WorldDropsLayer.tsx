import { useGameStore } from "../../store/gameStore";
import { WorldDropNode } from "./WorldDropNode";

export function WorldDropsLayer() {
  const drops = useGameStore((s) => s.worldDrops);
  return (
    <>
      {drops.map((drop) => (
        <WorldDropNode key={drop.id} drop={drop} />
      ))}
    </>
  );
}
