import "./App.css";
import { DataProvider } from "./context/DataContext";
import { useRows, useDataDispatch } from "./context/useDataContext";
import { FileUpload } from "./components/FileUpload";
import { VirtualTable } from "./components/VirtualTable";
import { SaveButton } from "./components/SaveButton";

function AppContent() {
  const rows = useRows();
  const dispatch = useDataDispatch();

  if (rows.length === 0) {
    return <FileUpload />;
  }

  return (
    <div className="app-content">
      <div className="toolbar">
        <span>{rows.length} rows</span>
        <div className="toolbar-actions">
          <button
            className="reset-button"
            onClick={() => dispatch({ type: "SET_DATA", columns: [], rows: [] })}
          >
            Reset
          </button>
          <SaveButton />
        </div>
      </div>
      <VirtualTable />
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
