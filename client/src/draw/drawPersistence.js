import { STORAGE_KEY, PALETTE_KEY, DEFAULT_COLORS } from "./drawConstants";

export function loadCanvas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.objects)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCanvas(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadPalette() {
  try {
    const raw = localStorage.getItem(PALETTE_KEY);
    if (!raw) return [...DEFAULT_COLORS];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [...DEFAULT_COLORS];
    return parsed;
  } catch {
    return [...DEFAULT_COLORS];
  }
}

export function savePalette(colors) {
  try {
    localStorage.setItem(PALETTE_KEY, JSON.stringify(colors));
    return true;
  } catch {
    return false;
  }
}
