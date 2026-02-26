import { Link } from "react-router";
import { useAuth } from "../contexts/useAuth";

const NavBar = () => {
  const auth = useAuth();
  const authenticated = auth.authenticated;
  const loaded = auth.loaded;

  return (
    <nav className="navbar">
      <div className="navbar-skills title">Skill Trainer</div>
      <Link to="/" className="navbar-skills nav-item">
        Skills
      </Link>
      <Link to="/stats" className="navbar-stats nav-item">
        Statistics
      </Link>
      {authenticated && loaded && (
        <button
          className="navbar-logout nav-item"
          onClick={() => {
            auth.logoutUser();
          }}
        >
          Logout
        </button>
      )}
      {!authenticated && loaded && (
        <>
          <Link to="/login" className="navbar-login nav-item">
            Login
          </Link>
          <Link to="/register" className="navbar-register nav-item">
            Register
          </Link>
        </>
      )}
      {!loaded && <div className="navbar-stats">Loading...</div>}
    </nav>
  );
};

export default NavBar;
