import { AuthProvider } from "./context/AuthContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import { SearchFocusProvider } from "./context/SearchFocusContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <SearchFocusProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </SearchFocusProvider>
      </ComparisonProvider>
    </AuthProvider>
  );
}

export default App;
