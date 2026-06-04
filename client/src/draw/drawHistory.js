// Undo/redo over full snapshots of the objects array.
// Each `commit` pushes the prior present onto `past` and clears `future`.

export function createHistory(present = []) {
  return { past: [], present, future: [] };
}

export function commit(history, nextPresent) {
  return {
    past: [...history.past, history.present],
    present: nextPresent,
    future: [],
  };
}

export function undo(history) {
  if (history.past.length === 0) return history;
  const previous = history.past[history.past.length - 1];
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redo(history) {
  if (history.future.length === 0) return history;
  const next = history.future[0];
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
  };
}

export const canUndo = (history) => history.past.length > 0;
export const canRedo = (history) => history.future.length > 0;
