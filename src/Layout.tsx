import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import ComparisonFloatButton from "./components/recipe-comparison/comparison-float-button/ComparisonFloatButton";
import AuthenticationModal from "./components/profile/authentication-modal/AuthenticationModal";
import { useComparisonContext } from "./context/ComparisonContext";
import { useAuthContext } from "./context/AuthContext";
import styles from "./Layout.module.scss";

const COMPARISON_FLOAT_ROUTES = ["/", "/catalog"];

const Layout = () => {
  const { comparisonList } = useComparisonContext();
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const showFloat = COMPARISON_FLOAT_ROUTES.includes(location.pathname);

  useEffect(() => {
    const state = location.state as { openAuthModal?: boolean } | null;
    if (state?.openAuthModal) {
      openAuthModal();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, openAuthModal, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      {showFloat && <ComparisonFloatButton count={comparisonList.length} />}
      <AuthenticationModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};

export default Layout;
