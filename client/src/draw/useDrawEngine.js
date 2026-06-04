import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SIZE,
  DEFAULT_COLORS,
  MIN_SCALE,
  MAX_SCALE,
  TOOLS,
  FONT_FAMILY,
  TEXT_SIZE_FACTOR,
  TEXT_MIN_PX,
} from "./drawConstants";
import {
  screenToWorld,
  createStroke,
  createRect,
  createEllipse,
  createText,
  hitTest,
} from "./drawModel";
import {
  createHistory,
  commit,
  undo as undoHistory,
  redo as redoHistory,
  canUndo as histCanUndo,
  canRedo as histCanRedo,
} from "./drawHistory";
import { renderScene, exportCanvas } from "./drawRender";
import { loadCanvas, saveCanvas, loadPalette, savePalette } from "./drawPersistence";

const ERASER_TOLERANCE = 6; // screen px, divided by scale to get world tolerance
const MIN_SHAPE = 2; // world px below which a drag commits nothing

export function useDrawEngine() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // mutable state that must NOT trigger re-render
  const historyRef = useRef(createHistory([]));
  const viewportRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 });
  const draftRef = useRef(null);
  const pointerRef = useRef({ drawing: false, panning: false, last: null, spaceDown: false });
  const saveTimer = useRef(null);

  // UI-reflected state
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [palette, setPalette] = useState([...DEFAULT_COLORS]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [textInput, setTextInput] = useState(null); // { worldX, worldY, screenX, screenY }
  const [textValue, setTextValue] = useState("");

  // live values used inside DOM-event closures that are bound once
  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const sizeRef = useRef(size);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { sizeRef.current = size; }, [size]);

  const syncUndoState = useCallback(() => {
    setCanUndo(histCanUndo(historyRef.current));
    setCanRedo(histCanRedo(historyRef.current));
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    renderScene(ctx, {
      objects: historyRef.current.present,
      viewport: viewportRef.current,
      width: canvas.width,
      height: canvas.height,
      preview: draftRef.current,
    });
  }, []);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveCanvas({ objects: historyRef.current.present, viewport: viewportRef.current });
    }, 500);
  }, []);

  const commitObjects = useCallback((next) => {
    historyRef.current = commit(historyRef.current, next);
    syncUndoState();
    redraw();
    scheduleSave();
  }, [redraw, scheduleSave, syncUndoState]);

  const undo = useCallback(() => {
    historyRef.current = undoHistory(historyRef.current);
    syncUndoState();
    redraw();
    scheduleSave();
  }, [redraw, scheduleSave, syncUndoState]);

  const redo = useCallback(() => {
    historyRef.current = redoHistory(historyRef.current);
    syncUndoState();
    redraw();
    scheduleSave();
  }, [redraw, scheduleSave, syncUndoState]);

  const clear = useCallback(() => {
    if (historyRef.current.present.length === 0) return;
    if (!window.confirm("Clear the entire canvas?")) return;
    commitObjects([]);
  }, [commitObjects]);

  const exportPng = useCallback(() => {
    const canvas = exportCanvas(historyRef.current.present);
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drawing-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, []);

  const setPaletteColor = useCallback((index) => {
    setPalette((prev) => {
      const next = prev.map((c, i) => (i === index ? colorRef.current : c));
      savePalette(next);
      return next;
    });
  }, []);

  const resetPalette = useCallback(() => {
    const next = [...DEFAULT_COLORS];
    savePalette(next);
    setPalette(next);
  }, []);

  const commitText = useCallback(() => {
    const t = textInput;
    setTextInput(null);
    const value = textValue;
    setTextValue("");
    if (!t || !value.trim()) return;
    const px = Math.max(TEXT_MIN_PX, sizeRef.current * TEXT_SIZE_FACTOR);
    const obj = createText({ color: colorRef.current, size: px, x: t.worldX, y: t.worldY, text: value, font: FONT_FAMILY });
    commitObjects([...historyRef.current.present, obj]);
  }, [textInput, textValue, commitObjects]);

  const cancelText = useCallback(() => {
    setTextInput(null);
    setTextValue("");
  }, []);

  // --- pointer handlers (bound on the canvas element in DrawCanvas) ---

  const onPointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    canvas.setPointerCapture(e.pointerId);
    const screen = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    const world = screenToWorld(screen, viewportRef.current);

    if (pointerRef.current.spaceDown || e.button === 1) {
      pointerRef.current.panning = true;
      pointerRef.current.last = screen;
      return;
    }
    if (e.button !== 0) return;

    const t = toolRef.current;
    if (t === TOOLS.TEXT) {
      setTextInput({ worldX: world.x, worldY: world.y, screenX: screen.x, screenY: screen.y });
      setTextValue("");
      return;
    }
    if (t === TOOLS.ERASER) {
      pointerRef.current.drawing = true;
      const tol = ERASER_TOLERANCE / viewportRef.current.scale;
      const id = hitTest(historyRef.current.present, world, tol);
      if (id) commitObjects(historyRef.current.present.filter((o) => o.id !== id));
      return;
    }
    pointerRef.current.drawing = true;
    if (t === TOOLS.PENCIL) {
      draftRef.current = createStroke({ color: colorRef.current, size: sizeRef.current, points: [world] });
    } else if (t === TOOLS.RECT || t === TOOLS.ELLIPSE) {
      draftRef.current = {
        type: t,
        color: colorRef.current,
        size: sizeRef.current,
        x: world.x,
        y: world.y,
        w: 0,
        h: 0,
        _start: world,
      };
    }
    redraw();
  }, [commitObjects, redraw]);

  const onPointerMove = useCallback((e) => {
    const screen = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    if (pointerRef.current.panning) {
      const last = pointerRef.current.last;
      viewportRef.current = {
        ...viewportRef.current,
        offsetX: viewportRef.current.offsetX + (screen.x - last.x),
        offsetY: viewportRef.current.offsetY + (screen.y - last.y),
      };
      pointerRef.current.last = screen;
      redraw();
      return;
    }
    if (!pointerRef.current.drawing) return;
    const world = screenToWorld(screen, viewportRef.current);
    if (toolRef.current === TOOLS.ERASER) {
      const tol = ERASER_TOLERANCE / viewportRef.current.scale;
      const id = hitTest(historyRef.current.present, world, tol);
      if (id) commitObjects(historyRef.current.present.filter((o) => o.id !== id));
      return;
    }
    const draft = draftRef.current;
    if (!draft) return;
    if (draft.type === "stroke") {
      draft.points.push(world);
    } else {
      draft.x = draft._start.x;
      draft.y = draft._start.y;
      draft.w = world.x - draft._start.x;
      draft.h = world.y - draft._start.y;
    }
    redraw();
  }, [commitObjects, redraw]);

  const onPointerUp = useCallback(() => {
    if (pointerRef.current.panning) {
      pointerRef.current.panning = false;
      scheduleSave();
      return;
    }
    if (!pointerRef.current.drawing) return;
    pointerRef.current.drawing = false;
    const draft = draftRef.current;
    draftRef.current = null;
    if (!draft) {
      redraw();
      return;
    }
    let obj = null;
    if (draft.type === "stroke") {
      obj = draft; // already a valid stroke object (has id/type/color/size/points)
    } else if (Math.abs(draft.w) >= MIN_SHAPE || Math.abs(draft.h) >= MIN_SHAPE) {
      const make = draft.type === "rect" ? createRect : createEllipse;
      obj = make({ color: draft.color, size: draft.size, x: draft.x, y: draft.y, w: draft.w, h: draft.h });
    }
    if (obj) commitObjects([...historyRef.current.present, obj]);
    else redraw();
  }, [commitObjects, redraw, scheduleSave]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const vp = viewportRef.current;
    const screen = { x: e.offsetX, y: e.offsetY };
    const worldBefore = screenToWorld(screen, vp);
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, vp.scale * factor));
    viewportRef.current = {
      scale,
      offsetX: screen.x - worldBefore.x * scale,
      offsetY: screen.y - worldBefore.y * scale,
    };
    redraw();
    scheduleSave();
  }, [redraw, scheduleSave]);

  // --- init: ctx, sizing, load persisted state + palette ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    ctxRef.current = canvas.getContext("2d");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);

    const saved = loadCanvas();
    if (saved) {
      historyRef.current = createHistory(saved.objects);
      if (saved.viewport) viewportRef.current = saved.viewport;
    }
    setPalette(loadPalette());
    setColor(loadPalette()[0]);
    syncUndoState();
    redraw();

    return () => window.removeEventListener("resize", resize);
  }, [redraw, syncUndoState]);

  // --- wheel listener with passive:false so preventDefault works ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const handler = (e) => onWheel(e);
    canvas.addEventListener("wheel", handler, { passive: false });
    return () => canvas.removeEventListener("wheel", handler);
  }, [onWheel]);

  // --- keyboard: space-pan toggle + undo/redo ---
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        pointerRef.current.spaceDown = true;
      }
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "Space") pointerRef.current.spaceDown = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [undo, redo]);

  return {
    canvasRef,
    tool, setTool,
    color, setColor,
    size, setSize,
    palette, setPaletteColor, resetPalette,
    canUndo, canRedo, undo, redo,
    clear, exportPng,
    onPointerDown, onPointerMove, onPointerUp,
    textInput, textValue, setTextValue, commitText, cancelText,
  };
}
