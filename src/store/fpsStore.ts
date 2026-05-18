import { create } from "zustand";

type FpsState = {
  fps: number | null;
  setFps: (fps: number) => void;
};

export const useFpsStore = create<FpsState>((set) => ({
  fps: null,
  setFps: (fps) => set({ fps }),
}));
