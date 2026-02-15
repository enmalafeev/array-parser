import { useEffect, useReducer, useRef, type ReactNode } from "react";
import type { AppAction, AppState } from "../types";
import { ColumnsContext, RowsContext, DispatchContext, RowsRefContext } from "./contexts";

const initialState: AppState = { columns: [], rows: [] };

function assertNever(value: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(value)}`);
}

function dataReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_DATA":
      return { columns: action.columns, rows: action.rows };
    case "UPDATE_CELL":
      return {
        ...state,
        rows: state.rows.map((row, i) =>
          i === action.rowIndex
            ? { ...row, [action.column]: action.value }
            : row
        ),
      };
    default:
      return assertNever(action);
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const rowsRef = useRef(state.rows);
  useEffect(() => {
    rowsRef.current = state.rows;
  }, [state.rows]);

  return (
    <ColumnsContext.Provider value={state.columns}>
      <RowsContext.Provider value={state.rows}>
        <DispatchContext.Provider value={dispatch}>
          <RowsRefContext.Provider value={rowsRef}>
            {children}
          </RowsRefContext.Provider>
        </DispatchContext.Provider>
      </RowsContext.Provider>
    </ColumnsContext.Provider>
  );
}
