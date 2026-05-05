import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-name">Basquiat.</div>
          <p className="footer-brand-desc">
            Where street culture meets luxury. Each piece is a statement — 
            bold, unapologetic, and crafted for those who wear their crown daily.
          </p>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Quick Links</div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Contact</div>
          <ul>
            <li><a href="mailto:hello@basquiat.com">hello@basquiat.com</a></li>
            <li><a href="tel:+2340000000000">+234 000 000 0000</a></li>
            <li><a href="#">Lagos, Nigeria</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">
          &copy; {new Date().getFullYear()} Basquiat. All rights reserved.
        </span>
        <div className="footer-socials">
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="Twitter">X</a>
          <a href="#" aria-label="TikTok">TK</a>
        </div>
      </div>
    </footer>
  );
}