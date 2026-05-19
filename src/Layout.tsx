import { Outlet } from "react-router";

import Header from "./components/common/header/Header";
import styles from "./Layout.module.scss";

const Layout = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
