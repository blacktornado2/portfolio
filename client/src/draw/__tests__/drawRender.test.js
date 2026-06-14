import { describe, it, expect, afterEach } from "vitest";
import { resolveColor, pruneLaser, laserAlpha } from "../drawRender";
import { LASER_LIFETIME } from "../drawConstants";

afterEach(() => {
  document.documentElement.style.removeProperty("--accent");
});

describe("resolveColor", () => {
  it("returns plain hex colors unchanged", () => {
    expect(resolveColor("#FFFFFF")).toBe("#FFFFFF");
    expect(resolveColor("#3B82F6")).toBe("#3B82F6");
  });

  it("resolves a CSS custom property to its computed value", () => {
    document.documentElement.style.setProperty("--accent", "#E8B84B");
    expect(resolveColor("var(--accent)")).toBe("#E8B84B");
  });

  it("never leaks an unparseable var() string to the canvas", () => {
    // Canvas silently keeps its previous color when assigned an invalid value,
    // which is the root cause of shapes inheriting each other's colors.
    const result = resolveColor("var(--accent)");
    expect(result.includes("var(")).toBe(false);
  });

  it("falls back to a concrete color when the variable is undefined", () => {
    const result = resolveColor("var(--nope)");
    expect(result.includes("var(")).toBe(false);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("pruneLaser", () => {
  const now = 10_000;

  it("drops points older than the lifetime", () => {
    const points = [
      { x: 0, y: 0, t: now - LASER_LIFETIME - 1, m: true }, // expired
      { x: 1, y: 1, t: now - 100, m: false }, // fresh
    ];
    const kept = pruneLaser(points, now);
    expect(kept).toHaveLength(1);
    expect(kept[0].x).toBe(1);
  });

  it("keeps points exactly at the lifetime boundary out (>= lifetime expires)", () => {
    const points = [{ x: 0, y: 0, t: now - LASER_LIFETIME, m: true }];
    expect(pruneLaser(points, now)).toHaveLength(0);
  });

  it("returns an empty array when all points are expired", () => {
    const points = [
      { x: 0, y: 0, t: now - 5000, m: true },
      { x: 1, y: 1, t: now - 4000, m: false },
    ];
    expect(pruneLaser(points, now)).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const points = [{ x: 0, y: 0, t: now, m: true }];
    pruneLaser(points, now);
    expect(points).toHaveLength(1);
  });
});

describe("laserAlpha", () => {
  it("is fully opaque for a brand-new point", () => {
    expect(laserAlpha(0)).toBe(1);
  });

  it("is fully transparent at/after the lifetime", () => {
    expect(laserAlpha(LASER_LIFETIME)).toBe(0);
    expect(laserAlpha(LASER_LIFETIME + 500)).toBe(0);
  });

  it("fades linearly across the lifetime", () => {
    expect(laserAlpha(LASER_LIFETIME / 2)).toBeCloseTo(0.5, 5);
  });
});
