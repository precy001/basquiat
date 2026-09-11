import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={close}>
          <span>BASQUIAT</span><small>IN GOD WE TRUST</small>
        </Link>
        <nav className={`nav-links${open ? " open" : ""}`}>
          <NavLink to="/shop" onClick={close}>New In</NavLink>
          <NavLink to="/shop" onClick={close}>Shop</NavLink>
          <a href="/#collections" onClick={close}>Collections</a>
          <a href="/#world" onClick={close}>About</a>
          <a href="mailto:hello@basquiat.com" onClick={close}>Contact</a>
        </nav>
        <div className="nav-actions">
          <button aria-label="Search" className="nav-icon">⌕</button>
          <Link to="/cart" className="nav-bag" aria-label="Shopping bag">
            ♡ <span>{totalItems}</span>
          </Link>
          <button className={`nav-hamburger${open ? " open" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
