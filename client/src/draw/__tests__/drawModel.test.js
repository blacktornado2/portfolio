import { describe, it, expect } from "vitest";
import { screenToWorld, worldToScreen } from "../drawModel";

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
