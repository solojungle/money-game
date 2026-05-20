const base = import.meta.env.BASE_URL;

export const ORE_MINERAL_GLB_URL = `${base}models/ores/mineral.glb`;
export const ORE_CRYSTAL_GLB_URL = `${base}models/ores/crystal.glb`;

export const ORE_GLB_URLS = [ORE_MINERAL_GLB_URL, ORE_CRYSTAL_GLB_URL] as const;
