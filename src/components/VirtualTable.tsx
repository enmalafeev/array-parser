import { memo, useCallback, useRef } from "react";
import { useColumns, useRows } from "../context/useDataContext";
import { useVirtualizer } from "../hooks/useVirtualizer";
import { VirtualRow } from "./VirtualRow";

const ROW_HEIGHT = 36;

const TableHeader = memo(function TableHeader({ columns }: { columns: string[] }) {
  return (
    <div className="table-header" role="row">
      {columns.map((col) => (
        <div key={col} className="table-header-cell" role="columnheader">
          {col}
        </div>
      ))}
    </div>
  );
});

export function VirtualTable() {
  const columns = useColumns();
  const rows = useRows();
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRafId = useRef(0);
  const { containerRef, onScroll, totalHeight, virtualItems } = useVirtualizer({
    itemCount: rows.length,
    itemHeight: ROW_HEIGHT,
  });

  const handleScroll = useCallback(() => {
    onScroll();
    if (!scrollRafId.current) {
      scrollRafId.current = requestAnimationFrame(() => {
        const body = containerRef.current;
        const header = headerRef.current;
        if (body && header) {
          header.scrollLeft = body.scrollLeft;
        }
        scrollRafId.current = 0;
      });
    }
  }, [onScroll, containerRef]);

  return (
    <div className="table-wrapper">
      <div className="table-header-wrapper">
        <div ref={headerRef} className="table-header-scroll">
          <TableHeader columns={columns} />
        </div>
      </div>
      <div
        ref={containerRef}
        className="table-body"
        onScroll={handleScroll}
        role="rowgroup"
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {virtualItems.map((item) => (
            <VirtualRow
              key={item.index}
              rowIndex={item.index}
              row={rows[item.index]}
              columns={columns}
              height={ROW_HEIGHT}
              offsetTop={item.offsetTop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
