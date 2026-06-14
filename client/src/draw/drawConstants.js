// localStorage keys
export const STORAGE_KEY = "draw:canvas";
export const PALETTE_KEY = "draw:palette";

// Default preset palette (gold, white, green, blue, red) — matches portfolio accent first
export const DEFAULT_COLORS = ["var(--accent)", "#FFFFFF", "#22C55E", "#3B82F6", "#EF4444"];

// Stroke/shape size slider bounds (px line width)
export const MIN_SIZE = 1;
export const MAX_SIZE = 40;
export const DEFAULT_SIZE = 4;

// Text size derives from the size slider
export const TEXT_SIZE_FACTOR = 4;
export const TEXT_MIN_PX = 14;

// Zoom bounds
export const MIN_SCALE = 0.2;
export const MAX_SCALE = 5;

// Selection / move / resize (neutral "no tool" mode)
export const SELECT_TOL = 6; // screen px tolerance for clicking thin objects
export const HANDLE_HIT = 10; // screen px tolerance to grab a resize handle
export const HANDLE_SIZE = 8; // screen px square handle size
export const MIN_RESIZE = 4; // min world size when resizing

// Laser (ephemeral glowing trail — never saved, undone, or exported)
export const LASER_LIFETIME = 2000; // ms before a point fully fades out
export const LASER_COLOR = "#FF3B30"; // glowing red
export const LASER_WIDTH = 4; // world px, beam thickness
export const LASER_GLOW = 12; // shadowBlur radius for the glow

// Export
export const EXPORT_PADDING = 40;
export const BG_COLOR = "#111111";

// Text font (project mono)
export const FONT_FAMILY = "'JetBrains Mono', monospace";

// Tool identifiers
export const TOOLS = {
  PENCIL: "pencil",
  RECT: "rect",
  ELLIPSE: "ellipse",
  TEXT: "text",
  ERASER: "eraser",
  LASER: "laser",
};
