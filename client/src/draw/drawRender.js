import {
  BG_COLOR,
  EXPORT_PADDING,
  HANDLE_SIZE,
  LASER_LIFETIME,
  LASER_COLOR,
  LASER_WIDTH,
  LASER_GLOW,
} from "./drawConstants";
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

// Opacity of a laser point given its age (ms). Linear fade, clamped to [0, 1].
export function laserAlpha(age, lifetime = LASER_LIFETIME) {
  if (age <= 0) return 1;
  if (age >= lifetime) return 0;
  return 1 - age / lifetime;
}

// Drop laser points older than the lifetime. Pure — returns a new array.
export function pruneLaser(points, now, lifetime = LASER_LIFETIME) {
  return points.filter((p) => now - p.t < lifetime);
}

// Parse a #RRGGBB hex into [r, g, b].
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const LASER_RGB = hexToRgb(LASER_COLOR);

// Split a flat point list into per-gesture groups. `m` (move) marks the start
// of a new stroke, so separate gestures aren't connected by a line.
function groupLaserStrokes(points) {
  const groups = [];
  let cur = [];
  for (const p of points) {
    if (p.m && cur.length) {
      groups.push(cur);
      cur = [];
    }
    cur.push(p);
  }
  if (cur.length) groups.push(cur);
  return groups;
}

// Stroke one gesture as a single continuous path. Stroking the whole polyline
// in one call (rather than per segment) avoids the overlapping round-cap
// "beads"; the head→tail fade is applied via a linear gradient so the glow
// stays smooth and continuous.
function strokeLaserGroup(ctx, group, now) {
  if (group.length < 2) return;
  const oldest = group[0];
  const newest = group[group.length - 1];
  const aOld = laserAlpha(now - oldest.t);
  const aNew = laserAlpha(now - newest.t);
  if (aNew <= 0 && aOld <= 0) return;

  const [r, g, b] = LASER_RGB;
  const buildGradient = (cr, cg, cb) => {
    const grad = ctx.createLinearGradient(oldest.x, oldest.y, newest.x, newest.y);
    grad.addColorStop(0, `rgba(${cr},${cg},${cb},${aOld})`);
    grad.addColorStop(1, `rgba(${cr},${cg},${cb},${aNew})`);
    return grad;
  };

  const trace = () => {
    ctx.beginPath();
    ctx.moveTo(group[0].x, group[0].y);
    for (let i = 1; i < group.length; i += 1) ctx.lineTo(group[i].x, group[i].y);
  };

  // red glow halo
  ctx.strokeStyle = buildGradient(r, g, b);
  ctx.lineWidth = LASER_WIDTH;
  ctx.shadowBlur = LASER_GLOW;
  trace();
  ctx.stroke();

  // hot near-white core
  ctx.strokeStyle = buildGradient(255, 229, 227);
  ctx.lineWidth = LASER_WIDTH / 2.5;
  ctx.shadowBlur = LASER_GLOW / 2;
  trace();
  ctx.stroke();
}

// Draw the ephemeral laser trail (world coords): a glowing red beam with a
// near-white core that fades from head to tail.
export function renderLaser(ctx, points, now) {
  if (!points || points.length < 2) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = LASER_COLOR;
  for (const group of groupLaserStrokes(points)) {
    strokeLaserGroup(ctx, group, now);
  }
  ctx.restore();
}

// Repaint the whole visible canvas: clear, fill bg, apply viewport, draw all + preview.
export function renderScene(ctx, { objects, viewport, width, height, preview, selection, laser }) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(viewport.scale, 0, 0, viewport.scale, viewport.offsetX, viewport.offsetY);
  for (const obj of objects) renderObject(ctx, obj);
  if (preview) renderObject(ctx, preview);
  if (laser) renderLaser(ctx, laser.points, laser.now);
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
