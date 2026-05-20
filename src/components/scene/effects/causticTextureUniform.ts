import type { Texture } from "three";

/** Shared tCaustic uniform for procedural RT + onBeforeCompile injects. */
export const causticTextureUniform: { value: Texture | null } = {
  value: null,
};
