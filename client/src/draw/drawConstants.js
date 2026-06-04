// localStorage keys
export const STORAGE_KEY = "draw:canvas";
export const PALETTE_KEY = "draw:palette";

// Default preset palette (gold, white, green, blue, red) — matches portfolio accent first
export const DEFAULT_COLORS = ["#E8B84B", "#FFFFFF", "#22C55E", "#3B82F6", "#EF4444"];

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
};
