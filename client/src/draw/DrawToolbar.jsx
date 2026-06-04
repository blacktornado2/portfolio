import React from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
} from "lucide-react";
import { TOOLS, MIN_SIZE, MAX_SIZE } from "./drawConstants";

const TOOL_BUTTONS = [
  { id: TOOLS.PENCIL, Icon: Pencil, label: "Pencil" },
  { id: TOOLS.RECT, Icon: Square, label: "Rectangle" },
  { id: TOOLS.ELLIPSE, Icon: Circle, label: "Ellipse" },
  { id: TOOLS.TEXT, Icon: Type, label: "Text" },
  { id: TOOLS.ERASER, Icon: Eraser, label: "Eraser" },
];

export default function DrawToolbar({ engine }) {
  const {
    tool, setTool,
    color, setColor,
    size, setSize,
    palette, setPaletteColor, resetPalette,
    canUndo, canRedo, undo, redo,
    clear, exportPng,
  } = engine;

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-[54px] bg-[#1A1A1A] border-b border-[#2A2A2A] flex items-center gap-4 px-4 overflow-x-auto">
      <Link
        to="/"
        className="font-mono text-xs text-[#888888] hover:text-[#E8B84B] transition-colors flex items-center gap-1.5 whitespace-nowrap"
      >
        ← portfolio
      </Link>

      <div className="w-px h-6 bg-[#2A2A2A] shrink-0" />

      <div className="flex gap-1.5 shrink-0">
        {TOOL_BUTTONS.map(({ id, Icon, label }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={tool === id}
            onClick={() => setTool(id)}
            className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
              tool === id
                ? "bg-[#E8B84B] text-[#111111]"
                : "bg-[#2A2A2A] text-[#888888] hover:text-white"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-[#2A2A2A] shrink-0" />

      <div className="flex gap-1.5 items-center shrink-0">
        {palette.map((c, i) => (
          <button
            key={i}
            type="button"
            title="Click to use · Right-click to set from current color"
            aria-label={`Preset color ${c}`}
            onClick={() => setColor(c)}
            onContextMenu={(e) => {
              e.preventDefault();
              setPaletteColor(i);
            }}
            className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
            style={{ background: c, borderColor: color === c ? "#FFFFFF" : "transparent" }}
          />
        ))}
        <label
          className="w-5 h-5 rounded-md overflow-hidden border border-[#2A2A2A] cursor-pointer relative"
          title="Custom color"
          style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label="Custom color picker"
          />
        </label>
        <button
          type="button"
          onClick={resetPalette}
          title="Reset palette to defaults"
          className="font-mono text-[10px] text-[#555555] hover:text-[#888888] transition-colors"
        >
          reset
        </button>
      </div>

      <div className="w-px h-6 bg-[#2A2A2A] shrink-0" />

      <div className="flex items-center gap-2 text-[#888888] font-mono text-[10px] shrink-0">
        size
        <input
          type="range"
          min={MIN_SIZE}
          max={MAX_SIZE}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="accent-[#E8B84B] w-20"
          aria-label="Brush size"
        />
      </div>

      <div className="flex-1 min-w-4" />

      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl/Cmd+Z)"
        aria-label="Undo"
        className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-white disabled:opacity-30 transition-colors shrink-0"
      >
        <Undo2 size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl/Cmd+Shift+Z)"
        aria-label="Redo"
        className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-white disabled:opacity-30 transition-colors shrink-0"
      >
        <Redo2 size={15} aria-hidden="true" />
      </button>

      <div className="w-px h-6 bg-[#2A2A2A] shrink-0" />

      <button
        type="button"
        onClick={clear}
        title="Clear canvas"
        className="font-mono text-[10px] text-[#888888] border border-[#2A2A2A] rounded-md px-2.5 py-1.5 hover:border-[#E8B84B] hover:text-[#E8B84B] transition-colors flex items-center gap-1.5 shrink-0"
      >
        <Trash2 size={12} aria-hidden="true" />
        clear
      </button>
      <button
        type="button"
        onClick={exportPng}
        title="Export as PNG"
        className="font-mono text-[10px] font-bold text-[#111111] bg-[#E8B84B] rounded-md px-3 py-1.5 hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0"
      >
        <Download size={12} aria-hidden="true" />
        export png
      </button>
    </header>
  );
}
