import { describe, it, expect } from "vitest";

describe("test runner", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });

  it("has jsdom localStorage", () => {
    localStorage.setItem("k", "v");
    expect(localStorage.getItem("k")).toBe("v");
    localStorage.clear();
  });
});
