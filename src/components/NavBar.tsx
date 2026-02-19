import { Link } from "react-router";
import { useAuth } from "../contexts/useAuth";

const NavBar = () => {
  const auth = useAuth();
  const authenticated = auth.authenticated;
  const loaded = auth.loaded;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-item">
        Skills
      </Link>
      <Link to="/stats" className="nav-item">
        Statistics
      </Link>
      {authenticated && loaded && (
        <button
          className="nav-item"
          onClick={() => {
            auth.logoutUser();
          }}
        >
          Logout
        </button>
      )}
      {!authenticated && loaded && (
        <>
          <Link to="/login" className="nav-item">
            Login
          </Link>
          <Link to="/register" className="nav-item">
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
