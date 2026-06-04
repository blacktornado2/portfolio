import { describe, it, expect } from "vitest";
import { screenToWorld, worldToScreen, createStroke, createRect, createEllipse, createText, normalizeRect } from "../drawModel";

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
