import { Routes, Route, Navigate } from "react-router";
import Layout from "./Layout";
import ProtectedRoute from "./router/ProtectedRoute";

import Home from "./pages/home-page/Home";
import Profile from "./pages/profile-page/Profile";
import Catalog from "./pages/catalog-page/Catalog";
import SmartMatcher from "./pages/smart-matcher-page/SmartMatcher";
import RecipeComparison from "./pages/recipe-comparison-page/RecipeComparison";
import RecipeDetail from "./pages/recipe-detail-page/RecipeDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="recipes/:id" element={<RecipeDetail />} />
        <Route path="smart-matcher" element={<SmartMatcher />} />
        <Route path="recipe-comparison" element={<RecipeComparison />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
