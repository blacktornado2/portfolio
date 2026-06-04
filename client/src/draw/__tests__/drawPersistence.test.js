import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  loadCanvas,
  saveCanvas,
  loadPalette,
  savePalette,
} from "../drawPersistence";
import { DEFAULT_COLORS, STORAGE_KEY, PALETTE_KEY } from "../drawConstants";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("canvas persistence", () => {
  it("returns null when nothing is stored", () => {
    expect(loadCanvas()).toBeNull();
  });

  it("round-trips a saved canvas", () => {
    const state = { objects: [{ id: "1", type: "rect", x: 0, y: 0, w: 1, h: 1 }], viewport: { offsetX: 5, offsetY: 6, scale: 2 } };
    expect(saveCanvas(state)).toBe(true);
    expect(loadCanvas()).toEqual(state);
  });

  it("returns null on corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadCanvas()).toBeNull();
  });

  it("returns null when objects is not an array", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ objects: "nope" }));
    expect(loadCanvas()).toBeNull();
  });

  it("saveCanvas returns false (does not throw) when storage rejects", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(saveCanvas({ objects: [] })).toBe(false);
  });
});

describe("palette persistence", () => {
  it("returns defaults when nothing is stored", () => {
    expect(loadPalette()).toEqual(DEFAULT_COLORS);
  });

  it("round-trips a saved palette", () => {
    const pal = ["#000", "#111", "#222", "#333", "#444"];
    expect(savePalette(pal)).toBe(true);
    expect(loadPalette()).toEqual(pal);
  });

  it("falls back to defaults on a non-array value", () => {
    localStorage.setItem(PALETTE_KEY, JSON.stringify({}));
    expect(loadPalette()).toEqual(DEFAULT_COLORS);
  });
});
