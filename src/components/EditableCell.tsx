import { memo, useState, useCallback, useRef, useEffect } from "react";
import { useDataDispatch } from "../context/useDataContext";
import type { JsonValue } from "../types";

interface EditableCellProps {
  rowIndex: number;
  column: string;
  value: JsonValue;
}

export const EditableCell = memo(function EditableCell({
  rowIndex,
  column,
  value,
}: EditableCellProps) {
  const dispatch = useDataDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEditing = useCallback(() => {
    setDraft(String(value ?? ""));
    setEditing(true);
  }, [value]);

  const commit = useCallback(() => {
    setEditing(false);
    const original = value;
    let parsed: JsonValue = draft;

    if (original === null && draft === "") return;
    if (typeof original === "number") {
      const n = Number(draft);
      if (!isNaN(n)) parsed = n;
    } else if (typeof original === "boolean") {
      if (draft === "true") parsed = true;
      else if (draft === "false") parsed = false;
    }

    if (parsed !== original) {
      dispatch({ type: "UPDATE_CELL", rowIndex, column, value: parsed });
    }
  }, [draft, value, rowIndex, column, dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") commit();
      if (e.key === "Escape") setEditing(false);
    },
    [commit],
  );

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="cell-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <span className="cell-text" onDoubleClick={startEditing}>
      {String(value ?? "")}
    </span>
  );
});
