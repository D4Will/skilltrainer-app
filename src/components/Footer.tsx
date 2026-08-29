import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer">
      <div>Developed by William Douglass</div>
      <Link to="/privacy-policy" className="footer-link">
        Privacy Policy
      </Link>
    </footer>
  );
};

export default Footer;
