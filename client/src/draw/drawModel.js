// --- coordinate transforms (world <-> screen) ---

export function screenToWorld(point, viewport) {
  return {
    x: (point.x - viewport.offsetX) / viewport.scale,
    y: (point.y - viewport.offsetY) / viewport.scale,
  };
}

export function worldToScreen(point, viewport) {
  return {
    x: point.x * viewport.scale + viewport.offsetX,
    y: point.y * viewport.scale + viewport.offsetY,
  };
}

// --- id generation ---

let idCounter = 0;
export function makeId() {
  idCounter += 1;
  return `obj_${idCounter}_${Date.now().toString(36)}`;
}

// --- normalize a rect so w/h are positive with a top-left origin ---

export function normalizeRect({ x, y, w, h }) {
  return {
    x: w < 0 ? x + w : x,
    y: h < 0 ? y + h : y,
    w: Math.abs(w),
    h: Math.abs(h),
  };
}

// --- object factories ---

export function createStroke({ color, size, points }) {
  return { id: makeId(), type: "stroke", color, size, points };
}

export function createRect({ color, size, x, y, w, h }) {
  return { id: makeId(), type: "rect", color, size, ...normalizeRect({ x, y, w, h }) };
}

export function createEllipse({ color, size, x, y, w, h }) {
  return { id: makeId(), type: "ellipse", color, size, ...normalizeRect({ x, y, w, h }) };
}

export function createText({ color, size, x, y, text, font }) {
  return { id: makeId(), type: "text", color, size, x, y, text, font };
}

// --- geometry helpers ---

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distanceToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return distance(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
}

// Approximate text box: mono char advance ~0.6em, height ~1em (drawn with textBaseline "top")
export function textBox(t) {
  const w = Math.max(t.text.length * t.size * 0.6, t.size);
  return { x: t.x, y: t.y, w, h: t.size };
}

function isPointNearStroke(stroke, p, tol) {
  const pts = stroke.points;
  const reach = tol + stroke.size / 2;
  if (pts.length === 1) return distance(pts[0], p) <= reach;
  for (let i = 0; i < pts.length - 1; i += 1) {
    if (distanceToSegment(p, pts[i], pts[i + 1]) <= reach) return true;
  }
  return false;
}

function isPointInRect(r, p, tol) {
  return (
    p.x >= r.x - tol && p.x <= r.x + r.w + tol &&
    p.y >= r.y - tol && p.y <= r.y + r.h + tol
  );
}

function isPointInEllipse(e, p, tol) {
  const rx = e.w / 2 + tol;
  const ry = e.h / 2 + tol;
  if (rx <= 0 || ry <= 0) return false;
  const cx = e.x + e.w / 2;
  const cy = e.y + e.h / 2;
  const dx = (p.x - cx) / rx;
  const dy = (p.y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function isPointInText(t, p, tol) {
  const box = textBox(t);
  return isPointInRect(box, p, tol);
}

function isHit(obj, p, tol) {
  switch (obj.type) {
    case "stroke": return isPointNearStroke(obj, p, tol);
    case "rect": return isPointInRect(obj, p, tol);
    case "ellipse": return isPointInEllipse(obj, p, tol);
    case "text": return isPointInText(obj, p, tol);
    default: return false;
  }
}

// Returns the id of the topmost object under `point`, or null.
export function hitTest(objects, point, tolerance) {
  for (let i = objects.length - 1; i >= 0; i -= 1) {
    if (isHit(objects[i], point, tolerance)) return objects[i].id;
  }
  return null;
}

// --- bounding box over all objects (world space); null when empty ---

export function getBoundingBox(objects) {
  if (objects.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const extend = (x, y) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };
  for (const obj of objects) {
    if (obj.type === "stroke") {
      for (const pt of obj.points) extend(pt.x, pt.y);
    } else if (obj.type === "rect" || obj.type === "ellipse") {
      extend(obj.x, obj.y);
      extend(obj.x + obj.w, obj.y + obj.h);
    } else if (obj.type === "text") {
      const box = textBox(obj);
      extend(box.x, box.y);
      extend(box.x + box.w, box.y + box.h);
    }
  }
  return { minX, minY, maxX, maxY };
}

// --- selection / move / resize helpers ---

// Bounds of a single object (world space).
export function objectBounds(obj) {
  return getBoundingBox([obj]);
}

// Return a copy of `obj` shifted by (dx, dy). Never mutates the original.
export function translateObject(obj, dx, dy) {
  if (obj.type === "stroke") {
    return { ...obj, points: obj.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
  }
  return { ...obj, x: obj.x + dx, y: obj.y + dy };
}

// Apply a handle drag (dx, dy world units) to an axis-aligned bounds box.
// The edges the handle controls move; the opposite edges stay anchored.
// Result is clamped to `minSize` (no collapse/flip).
export function resizeBounds(bounds, handle, dx, dy, minSize = 1) {
  let { minX, minY, maxX, maxY } = bounds;
  if (handle.includes("w")) minX += dx;
  if (handle.includes("e")) maxX += dx;
  if (handle.includes("n")) minY += dy;
  if (handle.includes("s")) maxY += dy;
  if (maxX - minX < minSize) {
    if (handle.includes("w")) minX = maxX - minSize;
    else maxX = minX + minSize;
  }
  if (maxY - minY < minSize) {
    if (handle.includes("n")) minY = maxY - minSize;
    else maxY = minY + minSize;
  }
  return { minX, minY, maxX, maxY };
}

// Return a copy of `obj` scaled so oldBounds maps onto newBounds.
export function resizeObject(obj, oldBounds, newBounds) {
  const ow = oldBounds.maxX - oldBounds.minX || 1;
  const oh = oldBounds.maxY - oldBounds.minY || 1;
  const sx = (newBounds.maxX - newBounds.minX) / ow;
  const sy = (newBounds.maxY - newBounds.minY) / oh;
  const mapX = (x) => newBounds.minX + (x - oldBounds.minX) * sx;
  const mapY = (y) => newBounds.minY + (y - oldBounds.minY) * sy;
  if (obj.type === "stroke") {
    return { ...obj, points: obj.points.map((p) => ({ x: mapX(p.x), y: mapY(p.y) })) };
  }
  if (obj.type === "text") {
    return { ...obj, x: mapX(obj.x), y: mapY(obj.y), size: Math.max(1, obj.size * sy) };
  }
  // rect / ellipse
  const x1 = mapX(obj.x);
  const y1 = mapY(obj.y);
  const x2 = mapX(obj.x + obj.w);
  const y2 = mapY(obj.y + obj.h);
  return { ...obj, x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) };
}

const HANDLE_IDS = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

// World-space positions of the 8 selection handles for a bounds box.
export function handlePositions(bounds) {
  const { minX, minY, maxX, maxY } = bounds;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  return {
    nw: { x: minX, y: minY }, n: { x: midX, y: minY }, ne: { x: maxX, y: minY },
    e: { x: maxX, y: midY }, se: { x: maxX, y: maxY }, s: { x: midX, y: maxY },
    sw: { x: minX, y: maxY }, w: { x: minX, y: midY },
  };
}

// Which handle (if any) is within `tol` of `point`. Returns its id or null.
export function handleAt(bounds, point, tol) {
  const pos = handlePositions(bounds);
  for (const id of HANDLE_IDS) {
    const h = pos[id];
    if (Math.abs(point.x - h.x) <= tol && Math.abs(point.y - h.y) <= tol) return id;
  }
  return null;
}
