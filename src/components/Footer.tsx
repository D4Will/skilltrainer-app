import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer">
      <div>Developed by William Douglass</div>
      <Link to="/devlog" className="footer-link">
        Dev log
      </Link>
      <Link to="/privacy-policy" className="footer-link">
        Privacy Policy
      </Link>
    </footer>
  );
};

export default Footer;
