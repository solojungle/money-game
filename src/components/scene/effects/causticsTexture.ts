import {
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";

/** Tileable caustics image served from `public/` (respects Vite `base`). */
export const CAUSTICS_TEXTURE_URL = `${import.meta.env.BASE_URL}textures/caustics/Caustic_Free.jpg`;

export function configureCausticsTexture(texture: Texture): Texture {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

let sharedTexture: Texture | null = null;
let loadPromise: Promise<Texture> | null = null;

/** Load the shared caustics map once (e.g. outside React). */
export function loadSharedCausticsTexture(): Promise<Texture> {
  if (sharedTexture) return Promise.resolve(sharedTexture);
  if (!loadPromise) {
    loadPromise = new TextureLoader()
      .loadAsync(CAUSTICS_TEXTURE_URL)
      .then((tex) => {
        sharedTexture = configureCausticsTexture(tex);
        return sharedTexture;
      })
      .catch((err) => {
        loadPromise = null;
        throw err;
      });
  }
  return loadPromise;
}

export function getSharedCausticsTexture(): Texture | null {
  return sharedTexture;
}

export function disposeSharedCausticsTexture(): void {
  sharedTexture?.dispose();
  sharedTexture = null;
  loadPromise = null;
}
