import { Routes, Route } from "react-router";
import Layout from "./Layout";

import Home from "./pages/home-page/Home";
import Profile from "./pages/profile-page/Profile";
import Catalog from "./pages/catalog-page/Catalog";
import SmartMatcher from "./pages/smart-matcher-page/SmartMatcher";
import RecipeComparison from "./pages/recipe-comparison-page/RecipeComparison";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="smart-matcher" element={<SmartMatcher />} />
        <Route path="recipe-comparison" element={<RecipeComparison />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
