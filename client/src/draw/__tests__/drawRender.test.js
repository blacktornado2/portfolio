import { describe, it, expect, afterEach } from "vitest";
import { resolveColor } from "../drawRender";

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
