import { Outlet, useLocation } from "react-router";

import Header from "./components/common/header/Header";
import ComparisonFloatButton from "./components/recipe-comparison/comparison-float-button/ComparisonFloatButton";
import { useComparisonContext } from "./context/ComparisonContext";
import styles from "./Layout.module.scss";

const COMPARISON_FLOAT_ROUTES = ["/", "/catalog"];

const Layout = () => {
  const { comparisonList } = useComparisonContext();
  const location = useLocation();
  const showFloat = COMPARISON_FLOAT_ROUTES.includes(location.pathname);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      {showFloat && <ComparisonFloatButton count={comparisonList.length} />}
    </>
  );
};

export default Layout;
