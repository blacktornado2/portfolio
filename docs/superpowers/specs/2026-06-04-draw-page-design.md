# Draw Page — Design Spec

**Date:** 2026-06-04
**Status:** Approved (pending written review)
**Route:** `/draw` (hidden, URL-only — no nav link anywhere)

## Purpose

A personal infinite-canvas drawing scratchpad living at `localhost:5173/draw`. Freehand
sketching, basic shapes, and text, with work auto-saved to the browser and exportable as
PNG. Phase 1 ships the core toolset; Phase 2 (glow pencil, line/arrow, etc.) is explicitly
deferred and out of scope here.

## Scope

### Phase 1 (this spec)
- Tools: **pencil**, **rectangle**, **ellipse**, **text**, **eraser**
- 5 preset colors + custom color picker; user-editable presets persisted to localStorage
- Brush/stroke size slider (also controls text size)
- Infinite canvas with pan (Space+drag / middle-mouse) and zoom (scroll wheel)
- Undo / redo (object-level)
- Clear canvas (with confirm)
- Auto-save to localStorage + restore on reload
- Export to PNG

### Phase 2 (deferred — NOT in this spec)
- Glow pencil, line/arrow tool, fill toggle, additional brushes

## Architecture

### Chosen approach: Object model + canvas re-render
Maintain a JS array of drawing objects. On every change, re-draw the entire canvas from
that array. This gives free undo/redo (array push/pop), clean infinite-canvas panning (a
viewport transform applied before render), and a natural growth path to Phase 2 effects
(per-object `ctx.shadowBlur`). Re-render cost is negligible at sketchpad object counts.

Rejected alternatives:
- **Pure raster canvas** — simplest/fastest, but baked pixels make undo, object-erase, and
  per-object effects impossible without a full repaint model anyway.
- **SVG DOM** — easy selection, but degrades with large freehand point counts and makes
  Phase 2 glow effects awkward.

### File structure
One feature folder, mirroring the existing `src/games/` and `src/blog/` conventions:

```
src/draw/
  DrawPage.jsx        # route component: layout, persistence wiring, rehydrate on mount
  DrawToolbar.jsx     # top bar: tools, colors, size, undo/redo, clear, export, back link
  DrawCanvas.jsx      # the <canvas>; pointer events delegated to the engine hook
  useDrawEngine.js    # object model, viewport transform, undo/redo, all draw logic
  drawConstants.js    # DEFAULT_COLORS, storage keys, size bounds, tool ids
```

Route registration in `src/App.jsx`:
```jsx
<Route path="/draw" element={<DrawPage />} />
```
No sub-routes. Lazy-loaded is optional (consistent with how games are imported today —
games are eager, so eager import is acceptable for parity).

### Layer responsibilities
| Layer | Owns |
|---|---|
| `useDrawEngine` | objects array, viewport `{offsetX, offsetY, scale}`, undo/redo stacks, active tool/color/size, `redraw()`, pointer handlers, export, hit-testing |
| `DrawCanvas` | single `<canvas>`, resize-to-window, forwards pointer/wheel/key events to the engine |
| `DrawToolbar` | presentational top bar; reads engine state, calls engine setters/actions |
| `DrawPage` | composes the above; rehydrates from localStorage on mount; debounced auto-save |

State lives entirely in `useDrawEngine` (React `useRef` for the mutable object array +
`useState` for UI-reflected values like active tool/color/size/canUndo). No external state
library.

## Data Model

All coordinates are stored in **world space** (infinite-canvas coords), never screen
pixels. Object shapes:

```js
// Freehand stroke
{ id, type: 'stroke', color, size, points: [{x, y}, ...] }

// Shapes
{ id, type: 'rect',    color, size, x, y, w, h }
{ id, type: 'ellipse', color, size, x, y, w, h }

// Text
{ id, type: 'text', color, size, x, y, text, font }   // font = project mono font
```

`id` is a monotonic counter or `crypto.randomUUID()`. `size` maps to `lineWidth` for
strokes/shapes and font pixel size for text.

### Viewport
`{ offsetX, offsetY, scale }`. Before each render: `ctx.setTransform`, apply translate +
scale, then draw all objects in world coords. Panning mutates offset; zoom mutates scale
around the cursor position. The visible canvas element itself stays window-sized.

## Interactions

### Render loop
Any change (new stroke point, shape preview, pan, zoom, commit, undo) triggers a single
`redraw()` that clears the canvas and repaints every committed object plus the
in-progress object. No dirty-rect optimization (unnecessary at this scale).

### Per-tool behavior
- **Pencil** — pointerdown starts a new stroke; pointermove pushes world-space points;
  pointerup commits the stroke to the array.
- **Rectangle / Ellipse** — pointerdown records the start corner; pointermove live-previews
  with current w/h; pointerup commits final geometry. (Click-and-drag to define.)
- **Text** — with text tool active, click drops a caret at that world point; an overlay
  input/contenteditable captures typing inline at the click location; Esc or click-away
  commits a `text` object. Empty text commits nothing.
- **Eraser** — hit-tests objects under the cursor and removes the whole object (object-level
  erase, consistent with the object model — not pixel erase). Each erase is one undo step.
- **Pan** — hold **Space** + drag, or middle-mouse drag, shifts viewport offset. Cursor
  switches to a grab cursor while panning.
- **Zoom** — scroll wheel zooms toward the cursor, clamped to sensible min/max scale.

### Hit-testing (eraser)
- stroke: point-near-polyline within a tolerance derived from stroke size
- rect/ellipse: bounding-box (and ellipse equation) containment
- text: measured text bounding box

## Persistence

### Auto-save (localStorage)
- Key `draw:canvas` → JSON of `{ objects, viewport }`.
- Debounced ~500ms after the last change.
- On mount, `DrawPage` rehydrates `objects` and `viewport` from this key, so a refresh
  restores both the drawing and the pan/zoom position.

### Editable preset palette
- Key `draw:palette` → JSON array of 5 hex colors.
- Defaults come from `DEFAULT_COLORS` in `drawConstants.js` (module-level constant, per the
  project's data-driven/constant pattern).
- **Right-click a preset swatch** replaces it with the current custom-picker color and
  persists the new palette. A reset action restores `DEFAULT_COLORS`.
- The custom picker (native `<input type="color">` styled as a swatch) is always available
  for one-off colors without altering presets.

### Failure handling
All localStorage reads/writes wrapped in try/catch. If storage is full or blocked (private
mode), drawing continues in-memory and persistence is silently skipped — never crash.

## Undo / Redo
- Object model is an array, so undo = remove the last committed object; redo = restore it.
- Redo stack clears on any new committed action.
- Operations are object-level: one stroke, one shape, one text, or one erase = one step.
- Bindings: **Ctrl/Cmd+Z** (undo), **Ctrl/Cmd+Shift+Z** (redo), plus toolbar buttons.
  Toolbar buttons disable when their stack is empty.

## Clear
"Clear canvas" empties the objects array. Shows a confirm dialog to prevent accidental
wipes. The clear is itself a single undoable action (push prior state so Ctrl+Z restores).

## Export PNG
The on-screen canvas is viewport-cropped and transparent, so export renders independently:
1. Compute the bounding box of all objects (skip if empty).
2. Create an off-screen canvas sized to the bbox + padding.
3. Fill the project background `#111111`.
4. Draw all objects in world coords offset to the bbox origin (ignores current pan/zoom).
5. `toBlob` → trigger download as `drawing-<timestamp>.png`.

This guarantees the export captures the entire drawing regardless of current view.

## Visual / Design System
Matches the portfolio "Dark Refined" tokens (see CLAUDE.md):
- Page background `#111111`; toolbar surface `#1A1A1A`; borders `#2A2A2A`.
- Gold accent `#E8B84B` for the active tool, primary export button, selected swatch ring.
- Secondary text/icons `#888888`.
- Top bar fixed, full-width, ~54px tall. Layout left→right:
  **back link → | tools | → colors → size slider → (spacer) → undo/redo | clear | export**
- Fonts: project mono for text-tool output and toolbar labels (`font-mono`).
- Back link mirrors the games page: "← Switch back to portfolio" → `/` via react-router `Link`.

## Out of Scope (Phase 1)
- Object selection / move / resize after commit (eraser is the only post-commit edit)
- Layers
- Multiple saved drawings / gallery (single canvas under one storage key)
- Server-side persistence (localStorage only, no backend involvement)
- Mobile/touch optimization beyond what Pointer Events provide for free
- Phase 2 tools (glow pencil, line/arrow, fill toggle, extra brushes)

## Testing Notes
- Engine logic (`useDrawEngine`) is the unit-test surface: object creation per tool,
  undo/redo stack transitions, hit-testing, world↔screen coordinate transforms, palette
  edit/reset, bounding-box computation for export.
- Persistence: serialize → rehydrate round-trip; graceful degradation when localStorage
  throws.
- Manual/visual: pan/zoom correctness, text inline entry, export output framing.
