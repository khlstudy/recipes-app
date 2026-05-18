import { Outlet } from "react-router";

import Header from "./components/common/header/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
