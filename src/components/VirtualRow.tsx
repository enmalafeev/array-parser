import { memo, useMemo } from "react";
import type { JsonRow } from "../types";
import { EditableCell } from "./EditableCell";

interface VirtualRowProps {
  rowIndex: number;
  row: JsonRow;
  columns: string[];
  height: number;
  offsetTop: number;
}

export const VirtualRow = memo(function VirtualRow({
  rowIndex,
  row,
  columns,
  height,
  offsetTop,
}: VirtualRowProps) {
  const style = useMemo(
    () => ({
      position: "absolute" as const,
      top: offsetTop,
      height,
      left: 0,
      right: 0,
    }),
    [offsetTop, height]
  );

  return (
    <div className="table-row" role="row" style={style}>
      {columns.map((col) => (
        <div key={col} className="table-cell" role="cell">
          <EditableCell
            rowIndex={rowIndex}
            column={col}
            value={row[col]}
          />
        </div>
      ))}
    </div>
  );
});
