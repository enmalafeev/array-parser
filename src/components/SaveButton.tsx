import { useCallback } from "react";
import { useRowsRef } from "../context/useDataContext";

export function SaveButton() {
  const rowsRef = useRowsRef();

  const handleSave = useCallback(() => {
    const json = JSON.stringify(rowsRef.current, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [rowsRef]);

  return (
    <button className="save-button" onClick={handleSave}>
      Save JSON
    </button>
  );
}
