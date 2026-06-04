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
