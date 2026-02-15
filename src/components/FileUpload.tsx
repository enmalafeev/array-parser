import { useCallback, useRef, useState, type DragEvent } from "react";
import { useDataDispatch } from "../context/useDataContext";
import type { JsonRow } from "../types";

export function FileUpload() {
  const dispatch = useDataDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rows = JSON.parse(e.target!.result as string) as JsonRow[];
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        dispatch({ type: "SET_DATA", columns, rows });
      };
      reader.readAsText(file);
    },
    [dispatch]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  return (
    <div
      className={`file-upload ${dragging ? "file-upload--dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        hidden
      />
      <p>Drop a JSON file here or click to upload</p>
    </div>
  );
}
