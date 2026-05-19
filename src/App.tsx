import { AuthProvider } from "./context/AuthContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <AppRoutes />
      </ComparisonProvider>
    </AuthProvider>
  );
}

export default App;
