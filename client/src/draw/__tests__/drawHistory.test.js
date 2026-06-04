import { describe, it, expect } from "vitest";
import {
  createHistory,
  commit,
  undo,
  redo,
  canUndo,
  canRedo,
} from "../drawHistory";

describe("history state machine", () => {
  it("starts with the given present and no undo/redo", () => {
    const h = createHistory(["a"]);
    expect(h.present).toEqual(["a"]);
    expect(canUndo(h)).toBe(false);
    expect(canRedo(h)).toBe(false);
  });

  it("commit advances present and enables undo", () => {
    let h = createHistory([]);
    h = commit(h, ["a"]);
    expect(h.present).toEqual(["a"]);
    expect(canUndo(h)).toBe(true);
    expect(canRedo(h)).toBe(false);
  });

  it("undo restores the previous present and enables redo", () => {
    let h = createHistory([]);
    h = commit(h, ["a"]);
    h = commit(h, ["a", "b"]);
    h = undo(h);
    expect(h.present).toEqual(["a"]);
    expect(canRedo(h)).toBe(true);
  });

  it("redo re-applies an undone present", () => {
    let h = createHistory([]);
    h = commit(h, ["a"]);
    h = undo(h);
    h = redo(h);
    expect(h.present).toEqual(["a"]);
    expect(canRedo(h)).toBe(false);
  });

  it("a new commit clears the redo stack", () => {
    let h = createHistory([]);
    h = commit(h, ["a"]);
    h = undo(h);
    h = commit(h, ["c"]);
    expect(canRedo(h)).toBe(false);
    expect(h.present).toEqual(["c"]);
  });

  it("undo/redo are no-ops at the ends", () => {
    let h = createHistory(["a"]);
    expect(undo(h)).toBe(h);
    expect(redo(h)).toBe(h);
  });
});
