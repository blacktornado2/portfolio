/* eslint-disable react/prop-types */
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
  } = engine;

  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="block w-full h-full touch-none"
        style={{ cursor: tool === TOOLS.ERASER ? "cell" : "crosshair" }}
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
          className="absolute bg-transparent border border-[#E8B84B] text-white font-mono text-sm outline-none px-1 py-0.5"
          style={{ left: textInput.screenX, top: textInput.screenY }}
        />
      )}
    </>
  );
}
