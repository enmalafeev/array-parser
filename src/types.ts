export type JsonValue = string | number | boolean | null;

export type JsonRow = Record<string, JsonValue>;

export interface AppState {
  columns: string[];
  rows: JsonRow[];
}

export type AppAction =
  | { type: "SET_DATA"; columns: string[]; rows: JsonRow[] }
  | { type: "UPDATE_CELL"; rowIndex: number; column: string; value: JsonValue };
