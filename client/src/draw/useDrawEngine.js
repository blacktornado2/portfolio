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
  SELECT_TOL,
  HANDLE_HIT,
  MIN_RESIZE,
} from "./drawConstants";
import {
  screenToWorld,
  createStroke,
  createRect,
  createEllipse,
  createText,
  hitTest,
  objectBounds,
  translateObject,
  resizeBounds,
  resizeObject,
  handleAt,
} from "./drawModel";
import {
  createHistory,
  commit,
  undo as undoHistory,
  redo as redoHistory,
  canUndo as histCanUndo,
  canRedo as histCanRedo,
} from "./drawHistory";
import { renderScene, exportCanvas, pruneLaser } from "./drawRender";
import { loadCanvas, saveCanvas, loadPalette, savePalette } from "./drawPersistence";

const ERASER_TOLERANCE = 6; // screen px, divided by scale to get world tolerance
const MIN_SHAPE = 2; // world px below which a drag commits nothing

// cursor shown when hovering each resize handle in select mode
const HANDLE_CURSORS = {
  nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize",
  n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
};

export function useDrawEngine() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // mutable state that must NOT trigger re-render
  const historyRef = useRef(createHistory([]));
  const viewportRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 });
  const draftRef = useRef(null);
  const pointerRef = useRef({ drawing: false, panning: false, last: null, spaceDown: false });
  const saveTimer = useRef(null);

  // ephemeral laser trail: world-space points {x, y, t, m}; never persisted/undone
  const laserRef = useRef([]);
  const laserRafRef = useRef(null);

  // UI-reflected state
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [palette, setPalette] = useState([...DEFAULT_COLORS]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [textInput, setTextInput] = useState(null); // { worldX, worldY, screenX, screenY }
  const [textValue, setTextValue] = useState("");
  const [selectedId, setSelectedId] = useState(null); // selected object id in neutral mode
  const [selectCursor, setSelectCursor] = useState("default"); // cursor while in select mode
  const [spaceHeld, setSpaceHeld] = useState(false); // space-to-pan held → grab cursor

  // select-mode interaction: { mode: 'move'|'resize'|null, handle, startWorld, origObj, origBounds }
  const selectRef = useRef({ mode: null, handle: null, startWorld: null, origObj: null, origBounds: null });
  const editDraftRef = useRef(null); // in-progress moved/resized object (preview)
  const selectedIdRef = useRef(null);
  const cursorRef = useRef("default");

  // live values used inside DOM-event closures that are bound once
  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const sizeRef = useRef(size);
  const textInputRef = useRef(textInput);
  const textValueRef = useRef(textValue);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { sizeRef.current = size; }, [size]);
  useEffect(() => { textInputRef.current = textInput; }, [textInput]);
  useEffect(() => { textValueRef.current = textValue; }, [textValue]);

  const syncUndoState = useCallback(() => {
    setCanUndo(histCanUndo(historyRef.current));
    setCanRedo(histCanRedo(historyRef.current));
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const present = historyRef.current.present;
    const edit = editDraftRef.current;
    const objects = edit ? present.map((o) => (o.id === edit.id ? edit : o)) : present;
    const selObj = objects.find((o) => o.id === selectedIdRef.current);
    renderScene(ctx, {
      objects,
      viewport: viewportRef.current,
      width: canvas.width,
      height: canvas.height,
      preview: draftRef.current,
      selection: selObj ? objectBounds(selObj) : null,
      laser: laserRef.current.length ? { points: laserRef.current, now: performance.now() } : null,
    });
  }, []);

  // rAF loop that fades the laser trail: prune expired points, repaint, and keep
  // ticking only while points remain (self-terminates so it costs nothing idle).
  const tickLaser = useCallback(() => {
    laserRef.current = pruneLaser(laserRef.current, performance.now());
    redraw();
    if (laserRef.current.length > 0) {
      laserRafRef.current = requestAnimationFrame(tickLaser);
    } else {
      laserRafRef.current = null;
    }
  }, [redraw]);

  const startLaserLoop = useCallback(() => {
    if (laserRafRef.current == null) {
      laserRafRef.current = requestAnimationFrame(tickLaser);
    }
  }, [tickLaser]);

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

  // Commit a specific text input + value to the object model (no React state reads).
  const commitTextValue = useCallback((t, value) => {
    if (!t || !value.trim()) return;
    const px = Math.max(TEXT_MIN_PX, sizeRef.current * TEXT_SIZE_FACTOR);
    const obj = createText({ color: colorRef.current, size: px, x: t.worldX, y: t.worldY, text: value, font: FONT_FAMILY });
    commitObjects([...historyRef.current.present, obj]);
  }, [commitObjects]);

  const commitText = useCallback(() => {
    const t = textInput;
    const value = textValue;
    setTextInput(null);
    setTextValue("");
    commitTextValue(t, value);
  }, [textInput, textValue, commitTextValue]);

  const cancelText = useCallback(() => {
    setTextInput(null);
    setTextValue("");
  }, []);

  // --- pointer handlers (bound on the canvas element in DrawCanvas) ---

  const onPointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    const screen = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    const world = screenToWorld(screen, viewportRef.current);

    if (pointerRef.current.spaceDown || e.button === 1) {
      canvas.setPointerCapture(e.pointerId);
      pointerRef.current.panning = true;
      pointerRef.current.last = screen;
      return;
    }
    if (e.button !== 0) return;

    const t = toolRef.current;
    if (t === null) {
      // neutral select / move / resize mode
      const scale = viewportRef.current.scale;
      const sel = historyRef.current.present.find((o) => o.id === selectedIdRef.current);
      // 1. grab a resize handle of the already-selected object?
      if (sel) {
        const handle = handleAt(objectBounds(sel), world, HANDLE_HIT / scale);
        if (handle) {
          canvas.setPointerCapture(e.pointerId);
          selectRef.current = { mode: "resize", handle, startWorld: world, origObj: sel, origBounds: objectBounds(sel) };
          return;
        }
      }
      // 2. select the topmost object under the cursor and start moving it
      const id = hitTest(historyRef.current.present, world, SELECT_TOL / scale);
      if (id) {
        canvas.setPointerCapture(e.pointerId);
        selectedIdRef.current = id;
        setSelectedId(id);
        const origObj = historyRef.current.present.find((o) => o.id === id);
        selectRef.current = { mode: "move", handle: null, startWorld: world, origObj, origBounds: null };
        redraw();
        return;
      }
      // 3. empty space → deselect
      selectedIdRef.current = null;
      setSelectedId(null);
      redraw();
      return;
    }
    if (t === TOOLS.TEXT) {
      // commit any in-progress text before starting a new one (mousedown is
      // preventDefaulted on the canvas, so blur won't fire on a same-canvas re-click)
      if (textInputRef.current) {
        commitTextValue(textInputRef.current, textValueRef.current);
      }
      setTextInput({ worldX: world.x, worldY: world.y, screenX: screen.x, screenY: screen.y });
      setTextValue("");
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    if (t === TOOLS.ERASER) {
      pointerRef.current.drawing = true;
      const tol = ERASER_TOLERANCE / viewportRef.current.scale;
      const id = hitTest(historyRef.current.present, world, tol);
      if (id) commitObjects(historyRef.current.present.filter((o) => o.id !== id));
      return;
    }
    pointerRef.current.drawing = true;
    if (t === TOOLS.LASER) {
      laserRef.current.push({ x: world.x, y: world.y, t: performance.now(), m: true });
      startLaserLoop();
      return;
    }
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
  }, [commitObjects, commitTextValue, redraw, startLaserLoop]);

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
    // select-mode drag (move or resize) and hover cursor
    if (toolRef.current === null) {
      const scale = viewportRef.current.scale;
      const world = screenToWorld(screen, viewportRef.current);
      const sel = selectRef.current;
      if (sel.mode === "move") {
        editDraftRef.current = translateObject(sel.origObj, world.x - sel.startWorld.x, world.y - sel.startWorld.y);
        redraw();
        return;
      }
      if (sel.mode === "resize") {
        const next = resizeBounds(sel.origBounds, sel.handle, world.x - sel.startWorld.x, world.y - sel.startWorld.y, MIN_RESIZE);
        editDraftRef.current = resizeObject(sel.origObj, sel.origBounds, next);
        redraw();
        return;
      }
      // hover: pick a cursor (resize handle > move over object > default)
      let cur = "default";
      const selObj = historyRef.current.present.find((o) => o.id === selectedIdRef.current);
      if (selObj) {
        const handle = handleAt(objectBounds(selObj), world, HANDLE_HIT / scale);
        if (handle) cur = HANDLE_CURSORS[handle];
      }
      if (cur === "default" && hitTest(historyRef.current.present, world, SELECT_TOL / scale)) cur = "move";
      if (cur !== cursorRef.current) {
        cursorRef.current = cur;
        setSelectCursor(cur);
      }
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
    if (toolRef.current === TOOLS.LASER) {
      laserRef.current.push({ x: world.x, y: world.y, t: performance.now(), m: false });
      startLaserLoop();
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
  }, [commitObjects, redraw, startLaserLoop]);

  const onPointerUp = useCallback(() => {
    if (pointerRef.current.panning) {
      pointerRef.current.panning = false;
      scheduleSave();
      return;
    }
    // finish a select-mode move/resize: commit the edited object (one undo step)
    if (selectRef.current.mode) {
      const edit = editDraftRef.current;
      selectRef.current = { mode: null, handle: null, startWorld: null, origObj: null, origBounds: null };
      editDraftRef.current = null;
      if (edit) {
        commitObjects(historyRef.current.present.map((o) => (o.id === edit.id ? edit : o)));
      }
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
    const pal = loadPalette();
    setPalette(pal);
    setColor(pal[0]);
    syncUndoState();
    redraw();

    return () => {
      window.removeEventListener("resize", resize);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (laserRafRef.current) cancelAnimationFrame(laserRafRef.current);
    };
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
      const tag = e.target.tagName;
      const editable = tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;
      if (e.code === "Space" && !editable) {
        e.preventDefault();
        if (!pointerRef.current.spaceDown) {
          pointerRef.current.spaceDown = true;
          setSpaceHeld(true); // show grab cursor (keydown auto-repeats, so guard)
        }
      }
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      // select-mode: delete the selected object
      if (!editable && toolRef.current === null && selectedIdRef.current && (e.key === "Delete" || e.key === "Backspace")) {
        e.preventDefault();
        const id = selectedIdRef.current;
        selectedIdRef.current = null;
        setSelectedId(null);
        commitObjects(historyRef.current.present.filter((o) => o.id !== id));
      }
      // Escape: deselect the current object, or enter select mode from a drawing tool
      if (!editable && e.key === "Escape") {
        if (toolRef.current === null && selectedIdRef.current) {
          selectedIdRef.current = null;
          setSelectedId(null);
          redraw();
        } else if (toolRef.current !== null) {
          setTool(null);
        }
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "Space") {
        pointerRef.current.spaceDown = false;
        setSpaceHeld(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [undo, redo, commitObjects, redraw]);

  // repaint the selection overlay whenever the selection changes
  useEffect(() => {
    selectedIdRef.current = selectedId;
    redraw();
  }, [selectedId, redraw]);

  // leaving select mode (picking a drawing tool) clears any selection
  useEffect(() => {
    if (tool !== null) setSelectedId(null);
  }, [tool]);

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
    selectCursor, spaceHeld,
  };
}
