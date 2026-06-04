import { BG_COLOR, EXPORT_PADDING } from "./drawConstants";
import { getBoundingBox } from "./drawModel";

// Draw a single object in the current (already-transformed) context.
export function renderObject(ctx, obj) {
  ctx.strokeStyle = obj.color;
  ctx.fillStyle = obj.color;
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

// Repaint the whole visible canvas: clear, fill bg, apply viewport, draw all + preview.
export function renderScene(ctx, { objects, viewport, width, height, preview }) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(viewport.scale, 0, 0, viewport.scale, viewport.offsetX, viewport.offsetY);
  for (const obj of objects) renderObject(ctx, obj);
  if (preview) renderObject(ctx, preview);
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
