import { BG_COLOR, EXPORT_PADDING, HANDLE_SIZE } from "./drawConstants";
import { getBoundingBox, worldToScreen } from "./drawModel";

// Concrete colour used when a CSS variable can't be resolved (e.g. in tests).
const COLOR_FALLBACK = "#E8B84B";

// Canvas can't parse CSS custom properties — assigning `var(--x)` to
// strokeStyle/fillStyle is a silent no-op, so the shape would inherit the
// previously drawn object's colour. Resolve any var() to its computed value
// (against :root) before it reaches the context.
export function resolveColor(color) {
  if (typeof color !== "string" || !color.includes("var(")) return color;
  const name = color.match(/var\(\s*(--[\w-]+)\s*\)/);
  if (!name || typeof window === "undefined" || !window.getComputedStyle) {
    return COLOR_FALLBACK;
  }
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(name[1])
    .trim();
  return resolved || COLOR_FALLBACK;
}

// Draw a single object in the current (already-transformed) context.
export function renderObject(ctx, obj) {
  const color = resolveColor(obj.color);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = obj.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (obj.type === "stroke") {
    const pts = obj.points;
    if (pts.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 1) {
      // single click -> a dot
      ctx.lineTo(pts[0].x + 0.01, pts[0].y);
    } else {
      for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
  } else if (obj.type === "rect") {
    ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
  } else if (obj.type === "ellipse") {
    ctx.beginPath();
    ctx.ellipse(
      obj.x + obj.w / 2,
      obj.y + obj.h / 2,
      Math.abs(obj.w / 2),
      Math.abs(obj.h / 2),
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  } else if (obj.type === "text") {
    ctx.textBaseline = "top";
    ctx.font = `${obj.size}px ${obj.font}`;
    ctx.fillText(obj.text, obj.x, obj.y);
  }
}

// Draw the selection box + 8 resize handles in SCREEN space, so they stay a
// constant size regardless of zoom. `bounds` is in world space.
export function renderSelection(ctx, bounds, viewport) {
  const tl = worldToScreen({ x: bounds.minX, y: bounds.minY }, viewport);
  const br = worldToScreen({ x: bounds.maxX, y: bounds.maxY }, viewport);
  const x = tl.x;
  const y = tl.y;
  const w = br.x - tl.x;
  const h = br.y - tl.y;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = "var(--accent)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  const midX = x + w / 2;
  const midY = y + h / 2;
  const points = [
    [x, y], [midX, y], [x + w, y],
    [x + w, midY], [x + w, y + h], [midX, y + h],
    [x, y + h], [x, midY],
  ];
  ctx.fillStyle = "var(--accent)";
  ctx.strokeStyle = "#111111";
  for (const [hx, hy] of points) {
    ctx.fillRect(hx - HANDLE_SIZE / 2, hy - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
    ctx.strokeRect(hx - HANDLE_SIZE / 2, hy - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
  }
  ctx.restore();
}

// Repaint the whole visible canvas: clear, fill bg, apply viewport, draw all + preview.
export function renderScene(ctx, { objects, viewport, width, height, preview, selection }) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(viewport.scale, 0, 0, viewport.scale, viewport.offsetX, viewport.offsetY);
  for (const obj of objects) renderObject(ctx, obj);
  if (preview) renderObject(ctx, preview);
  if (selection) renderSelection(ctx, selection, viewport);
}

// Render all objects to an offscreen canvas sized to their bounding box.
// Returns the canvas, or null when there is nothing to export.
export function exportCanvas(objects) {
  const box = getBoundingBox(objects);
  if (!box) return null;
  const width = Math.max(1, Math.ceil(box.maxX - box.minX + EXPORT_PADDING * 2));
  const height = Math.max(1, Math.ceil(box.maxY - box.minY + EXPORT_PADDING * 2));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
  ctx.translate(EXPORT_PADDING - box.minX, EXPORT_PADDING - box.minY);
  for (const obj of objects) renderObject(ctx, obj);
  return canvas;
}
