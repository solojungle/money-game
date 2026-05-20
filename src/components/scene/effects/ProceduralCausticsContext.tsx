import { createContext, useContext, type ReactNode } from "react";
import type { Texture } from "three";

const ProceduralCausticsTextureContext = createContext<Texture | null>(null);

export function useProceduralCausticsTexture(): Texture | null {
  return useContext(ProceduralCausticsTextureContext);
}

export function ProceduralCausticsTextureProvider({
  texture,
  children,
}: {
  texture: Texture;
  children: ReactNode;
}) {
  return (
    <ProceduralCausticsTextureContext.Provider value={texture}>
      {children}
    </ProceduralCausticsTextureContext.Provider>
  );
}
