import React from "react";
import { TOOLS } from "./drawConstants";

export default function DrawCanvas({ engine }) {
  const {
    canvasRef,
    tool,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    textInput,
    textValue,
    setTextValue,
    commitText,
    cancelText,
    selectCursor,
  } = engine;

  const cursor = tool === null ? selectCursor : tool === TOOLS.ERASER ? "cell" : "crosshair";

  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onMouseDown={(e) => e.preventDefault()}
        className="block w-full h-full touch-none"
        style={{ cursor }}
      />
      {textInput && (
        <input
          autoFocus
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitText();
            if (e.key === "Escape") cancelText();
          }}
          placeholder="type…"
          className="absolute bg-transparent border border-[var(--accent)] text-white font-mono text-sm outline-none px-1 py-0.5"
          style={{ left: textInput.screenX, top: textInput.screenY }}
        />
      )}
    </>
  );
}
