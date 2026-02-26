import { Outlet } from "react-router";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
