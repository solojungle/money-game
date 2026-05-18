import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../store/gameStore";

export function GameClock({ running }: { running: boolean }) {
  useFrame((_, delta) => {
    if (!running) return;
    useGameStore.getState().tick(delta * 1000);
  });
  return null;
}
