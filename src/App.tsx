import { AuthProvider } from "./context/AuthContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import { SearchFocusProvider } from "./context/SearchFocusContext";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <SearchFocusProvider>
          <AppRoutes />
        </SearchFocusProvider>
      </ComparisonProvider>
    </AuthProvider>
  );
}

export default App;
