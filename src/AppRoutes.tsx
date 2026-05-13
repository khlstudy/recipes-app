import { Routes, Route } from "react-router";
import Layout from "./Layout";

import Home from "./pages/home-page/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
