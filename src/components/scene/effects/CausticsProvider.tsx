import { createContext, useContext, type ReactNode } from "react";
import type { ShaderMaterial } from "three";
import { CAUSTICS } from "./causticsConfig";
import { useCausticsProjectedMaterial } from "./useCausticsProjectedMaterial";

const CausticsMaterialContext = createContext<ShaderMaterial | null>(null);

export function useCausticsMaterial(): ShaderMaterial {
  const material = useContext(CausticsMaterialContext);
  if (!material) {
    throw new Error("useCausticsMaterial must be used within CausticsProvider");
  }
  return material;
}

type CausticsProviderProps = {
  children: ReactNode;
  /** Override {@link CAUSTICS.strength} for this subtree. */
  strength?: number;
};

/** Shares one projected caustics material across seafloor + base interior surfaces. */
export function CausticsProvider({
  children,
  strength = CAUSTICS.strength,
}: CausticsProviderProps) {
  const material = useCausticsProjectedMaterial(strength);
  return (
    <CausticsMaterialContext.Provider value={material}>
      {children}
    </CausticsMaterialContext.Provider>
  );
}
