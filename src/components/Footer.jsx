import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-lockup footer-lockup">
            <div className="brand-main">BASQUIAT</div>
            <div className="brand-line" />
            <div className="brand-sub">IN GOD WE TRUST</div>
          </div>
          <p className="footer-brand-desc">Street culture meets considered everyday luxury.</p>
        </div>
        <div className="footer-col"><div className="footer-col-title">Shop</div><ul>
          <li><Link to="/shop">New In</Link></li><li><Link to="/shop">Shop All</Link></li><li><Link to="/cart">Your Bag</Link></li>
        </ul></div>
        <div className="footer-col"><div className="footer-col-title">Help</div><ul>
          <li><a href="#">Delivery</a></li><li><a href="#">Returns</a></li><li><a href="#">Size Guide</a></li><li><a href="#">FAQ</a></li>
        </ul></div>
        <div className="footer-col"><div className="footer-col-title">Connect</div><ul>
          <li><a href="https://www.instagram.com/basquiatng/" target="_blank" rel="noreferrer">Instagram</a></li>
          <li><a href="mailto:hello@basquiat.com">Email us</a></li><li><span>Lagos, Nigeria</span></li>
        </ul></div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} BASQUIAT. All rights reserved.</span>
        <span>IN GOD WE TRUST</span>
      </div>
    </footer>
  );
}
