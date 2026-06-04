import { describe, it, expect } from "vitest";
import { screenToWorld, worldToScreen, createStroke, createRect, createEllipse, createText, normalizeRect, hitTest, getBoundingBox, objectBounds, translateObject, resizeBounds, resizeObject, handleAt } from "../drawModel";

describe("coordinate transforms", () => {
  const viewport = { offsetX: 100, offsetY: 50, scale: 2 };

  it("screenToWorld inverts the viewport transform", () => {
    expect(screenToWorld({ x: 100, y: 50 }, viewport)).toEqual({ x: 0, y: 0 });
    expect(screenToWorld({ x: 120, y: 70 }, viewport)).toEqual({ x: 10, y: 10 });
  });

  it("worldToScreen applies the viewport transform", () => {
    expect(worldToScreen({ x: 0, y: 0 }, viewport)).toEqual({ x: 100, y: 50 });
    expect(worldToScreen({ x: 10, y: 10 }, viewport)).toEqual({ x: 120, y: 70 });
  });

  it("round-trips", () => {
    const p = { x: 37, y: -12 };
    const back = screenToWorld(worldToScreen(p, viewport), viewport);
    expect(back.x).toBeCloseTo(p.x);
    expect(back.y).toBeCloseTo(p.y);
  });
});

describe("normalizeRect", () => {
  it("keeps positive dimensions unchanged", () => {
    expect(normalizeRect({ x: 5, y: 10, w: 20, h: 30 })).toEqual({ x: 5, y: 10, w: 20, h: 30 });
  });

  it("flips negative width/height to a top-left origin", () => {
    expect(normalizeRect({ x: 30, y: 40, w: -20, h: -10 })).toEqual({ x: 10, y: 30, w: 20, h: 10 });
  });
});

describe("object factories", () => {
  it("createStroke builds a stroke with a unique id", () => {
    const a = createStroke({ color: "#fff", size: 3, points: [{ x: 0, y: 0 }] });
    const b = createStroke({ color: "#fff", size: 3, points: [{ x: 1, y: 1 }] });
    expect(a.type).toBe("stroke");
    expect(a.color).toBe("#fff");
    expect(a.size).toBe(3);
    expect(a.points).toEqual([{ x: 0, y: 0 }]);
    expect(a.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });

  it("createRect normalizes negative drags", () => {
    const r = createRect({ color: "#fff", size: 2, x: 30, y: 40, w: -20, h: -10 });
    expect(r.type).toBe("rect");
    expect(r).toMatchObject({ x: 10, y: 30, w: 20, h: 10 });
    expect(r.id).toBeTruthy();
  });

  it("createEllipse normalizes and tags type", () => {
    const e = createEllipse({ color: "#fff", size: 2, x: 0, y: 0, w: 10, h: 20 });
    expect(e.type).toBe("ellipse");
    expect(e).toMatchObject({ x: 0, y: 0, w: 10, h: 20 });
  });

  it("createText carries text/font/position", () => {
    const t = createText({ color: "#fff", size: 24, x: 5, y: 6, text: "hi", font: "monospace" });
    expect(t).toMatchObject({ type: "text", x: 5, y: 6, text: "hi", font: "monospace", size: 24 });
    expect(t.id).toBeTruthy();
  });
});

describe("hitTest", () => {
  const stroke = createStroke({ color: "#fff", size: 4, points: [{ x: 0, y: 0 }, { x: 100, y: 0 }] });
  const rect = createRect({ color: "#fff", size: 2, x: 200, y: 0, w: 50, h: 50 });
  const ellipse = createEllipse({ color: "#fff", size: 2, x: 300, y: 0, w: 100, h: 50 });
  const text = createText({ color: "#fff", size: 20, x: 500, y: 0, text: "abc", font: "monospace" });
  const objects = [stroke, rect, ellipse, text];

  it("returns null when nothing is under the point", () => {
    expect(hitTest(objects, { x: -50, y: -50 }, 5)).toBeNull();
  });

  it("hits a stroke near its polyline", () => {
    expect(hitTest(objects, { x: 50, y: 1 }, 5)).toBe(stroke.id);
  });

  it("hits a rectangle inside its bounds", () => {
    expect(hitTest(objects, { x: 220, y: 20 }, 2)).toBe(rect.id);
  });

  it("hits an ellipse at its centre but misses the bounding-box corner", () => {
    expect(hitTest(objects, { x: 350, y: 25 }, 0)).toBe(ellipse.id);
    expect(hitTest([ellipse], { x: 301, y: 1 }, 0)).toBeNull();
  });

  it("hits text within its measured box", () => {
    expect(hitTest(objects, { x: 505, y: 10 }, 0)).toBe(text.id);
  });

  it("returns the topmost (last) object when two overlap", () => {
    const a = createRect({ color: "#fff", size: 2, x: 0, y: 0, w: 100, h: 100 });
    const b = createRect({ color: "#fff", size: 2, x: 0, y: 0, w: 100, h: 100 });
    expect(hitTest([a, b], { x: 50, y: 50 }, 0)).toBe(b.id);
  });
});

describe("getBoundingBox", () => {
  it("returns null for an empty drawing", () => {
    expect(getBoundingBox([])).toBeNull();
  });

  it("wraps a single stroke's points", () => {
    const s = createStroke({ color: "#fff", size: 4, points: [{ x: 10, y: 20 }, { x: 30, y: 5 }] });
    expect(getBoundingBox([s])).toEqual({ minX: 10, minY: 5, maxX: 30, maxY: 20 });
  });

  it("includes rect, ellipse and text extents", () => {
    const r = createRect({ color: "#fff", size: 2, x: 0, y: 0, w: 50, h: 50 });
    const e = createEllipse({ color: "#fff", size: 2, x: 100, y: 100, w: 40, h: 40 });
    const box = getBoundingBox([r, e]);
    expect(box).toEqual({ minX: 0, minY: 0, maxX: 140, maxY: 140 });
  });
});

describe("objectBounds", () => {
  it("returns the bounds of a single rect", () => {
    const r = createRect({ color: "#fff", size: 2, x: 10, y: 20, w: 30, h: 40 });
    expect(objectBounds(r)).toEqual({ minX: 10, minY: 20, maxX: 40, maxY: 60 });
  });

  it("returns the bounds of a stroke", () => {
    const s = createStroke({ color: "#fff", size: 4, points: [{ x: 0, y: 0 }, { x: 50, y: 30 }] });
    expect(objectBounds(s)).toEqual({ minX: 0, minY: 0, maxX: 50, maxY: 30 });
  });
});

describe("translateObject", () => {
  it("shifts a rect's origin", () => {
    const r = createRect({ color: "#fff", size: 2, x: 10, y: 20, w: 30, h: 40 });
    const moved = translateObject(r, 5, -3);
    expect(moved).toMatchObject({ x: 15, y: 17, w: 30, h: 40, id: r.id });
  });

  it("shifts every point of a stroke", () => {
    const s = createStroke({ color: "#fff", size: 4, points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] });
    const moved = translateObject(s, 2, 3);
    expect(moved.points).toEqual([{ x: 2, y: 3 }, { x: 12, y: 13 }]);
    expect(moved.id).toBe(s.id);
  });

  it("does not mutate the original", () => {
    const r = createRect({ color: "#fff", size: 2, x: 0, y: 0, w: 10, h: 10 });
    translateObject(r, 5, 5);
    expect(r.x).toBe(0);
  });
});

describe("resizeBounds", () => {
  const bounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 };

  it("drags the SE corner, anchoring the NW corner", () => {
    expect(resizeBounds(bounds, "se", 20, 30)).toEqual({ minX: 0, minY: 0, maxX: 120, maxY: 130 });
  });

  it("drags the NW corner, anchoring the SE corner", () => {
    expect(resizeBounds(bounds, "nw", 10, 10)).toEqual({ minX: 10, minY: 10, maxX: 100, maxY: 100 });
  });

  it("an edge handle resizes only one axis", () => {
    expect(resizeBounds(bounds, "e", 25, 999)).toEqual({ minX: 0, minY: 0, maxX: 125, maxY: 100 });
  });

  it("clamps to the minimum size instead of collapsing/flipping", () => {
    const r = resizeBounds(bounds, "e", -200, 0, 4);
    expect(r.maxX).toBe(4);
    expect(r.minX).toBe(0);
  });
});

describe("resizeObject", () => {
  it("scales a rect from old bounds to new bounds", () => {
    const r = createRect({ color: "#fff", size: 2, x: 0, y: 0, w: 100, h: 100 });
    const out = resizeObject(r, { minX: 0, minY: 0, maxX: 100, maxY: 100 }, { minX: 0, minY: 0, maxX: 200, maxY: 50 });
    expect(out).toMatchObject({ x: 0, y: 0, w: 200, h: 50 });
  });

  it("scales every stroke point", () => {
    const s = createStroke({ color: "#fff", size: 4, points: [{ x: 0, y: 0 }, { x: 100, y: 100 }] });
    const out = resizeObject(s, { minX: 0, minY: 0, maxX: 100, maxY: 100 }, { minX: 0, minY: 0, maxX: 200, maxY: 200 });
    expect(out.points).toEqual([{ x: 0, y: 0 }, { x: 200, y: 200 }]);
  });

  it("scales text font size with the vertical scale", () => {
    const t = createText({ color: "#fff", size: 20, x: 0, y: 0, text: "hi", font: "monospace" });
    const out = resizeObject(t, { minX: 0, minY: 0, maxX: 100, maxY: 20 }, { minX: 0, minY: 0, maxX: 100, maxY: 40 });
    expect(out.size).toBe(40);
  });
});

describe("handleAt", () => {
  const bounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 };

  it("returns the corner handle id when near a corner", () => {
    expect(handleAt(bounds, { x: 1, y: 1 }, 5)).toBe("nw");
    expect(handleAt(bounds, { x: 100, y: 100 }, 5)).toBe("se");
  });

  it("returns an edge handle id near an edge midpoint", () => {
    expect(handleAt(bounds, { x: 50, y: 0 }, 5)).toBe("n");
    expect(handleAt(bounds, { x: 100, y: 50 }, 5)).toBe("e");
  });

  it("returns null when not near any handle", () => {
    expect(handleAt(bounds, { x: 50, y: 50 }, 5)).toBeNull();
  });
});
