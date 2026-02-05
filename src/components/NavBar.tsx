import { Link } from "react-router";
import { useAuth } from "../contexts/useAuth";

const NavBar = () => {
  const auth = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-item">
        Targets
      </Link>
      <Link to="/stats" className="nav-item">
        Statistics
      </Link>
      <Link to="/login" className="nav-item">
        Login
      </Link>
      <Link to="/register" className="nav-item">
        Register
      </Link>
      <button
        className="nav-item"
        onClick={() => {
          auth.logoutUser();
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
