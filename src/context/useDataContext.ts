import { useContext } from "react";
import { ColumnsContext, RowsContext, DispatchContext, RowsRefContext } from "./contexts";

export function useColumns() {
  return useContext(ColumnsContext);
}

export function useRows() {
  return useContext(RowsContext);
}

export function useDataDispatch() {
  return useContext(DispatchContext);
}

export function useRowsRef() {
  return useContext(RowsRefContext);
}
