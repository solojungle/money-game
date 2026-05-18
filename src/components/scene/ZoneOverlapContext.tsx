import { createContext } from "react";

export type ZoneApi = {
  enter: (id: string) => void;
  exit: (id: string) => void;
};

export const ZoneOverlapContext = createContext<ZoneApi | null>(null);
