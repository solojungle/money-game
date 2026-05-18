export type GraphicsSettingId = "resolution" | "verticalSync" | "upscalingMode";

export type GraphicsSettingDef = {
  id: GraphicsSettingId;
  section: "display" | "upscaling";
  label: string;
  detailTitle: string;
  description: string;
};

export const GRAPHICS_SETTINGS: GraphicsSettingDef[] = [
  {
    id: "resolution",
    section: "display",
    label: "Resolution",
    detailTitle: "Resolution",
    description:
      "Screen output size in pixels. Lower resolutions can improve performance on weaker hardware.",
  },
  {
    id: "verticalSync",
    section: "display",
    label: "Vertical Sync",
    detailTitle: "Vertical Sync",
    description:
      "Limits frame rate to your display refresh rate to reduce screen tearing. May add slight input latency.",
  },
  {
    id: "upscalingMode",
    section: "upscaling",
    label: "Upscaling Mode",
    detailTitle: "Upscaling Mode",
    description:
      "Renders the scene at a lower internal resolution, then scales up. Native uses your selected output resolution.",
  },
];

export const DEFAULT_GRAPHICS_SETTING: GraphicsSettingId = "resolution";
