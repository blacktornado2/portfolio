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
