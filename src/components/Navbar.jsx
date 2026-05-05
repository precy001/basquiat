import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/assets/logo.jpg";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/">
        <img src={logo} alt="Basquiat" className="nav-logo" />
        </Link>

        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          <li><Link to="/" className={isActive("/") ? "active" : ""}>Home</Link></li>
          <li><Link to="/shop" className={isActive("/shop") ? "active" : ""}>Shop</Link></li>
        </ul>

        <div
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>
  );
}