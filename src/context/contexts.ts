import { createContext, type Dispatch, type MutableRefObject } from "react";
import type { AppAction, JsonRow } from "../types";

export const ColumnsContext = createContext<string[]>([]);
export const RowsContext = createContext<JsonRow[]>([]);
export const DispatchContext = createContext<Dispatch<AppAction>>(() => {});
export const RowsRefContext = createContext<MutableRefObject<JsonRow[]>>({ current: [] });
