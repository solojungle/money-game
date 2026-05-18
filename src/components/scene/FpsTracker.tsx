import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useFpsStore } from "../../store/fpsStore";

export function FpsTracker() {
  const frames = useRef(0);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    frames.current += 1;
    elapsed.current += delta;
    if (elapsed.current < 0.5) return;

    const fps = Math.round(frames.current / elapsed.current);
    useFpsStore.getState().setFps(fps);
    frames.current = 0;
    elapsed.current = 0;
  });

  return null;
}
