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
      <div className="size-alert">
        This website is designed to be viewed on larger displays
      </div>
      <Footer />
    </>
  );
};

export default Layout;
