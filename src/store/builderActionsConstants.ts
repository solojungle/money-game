import { BUILDER_CATEGORIES, type BuilderCategory } from "../game/building";

export const defaultBuilderCategory: BuilderCategory = "standard_elements";

export const BUILDER_CATEGORY_ORDER: BuilderCategory[] = BUILDER_CATEGORIES.map(
  (c) => c.id,
);
