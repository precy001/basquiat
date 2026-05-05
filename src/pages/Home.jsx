import { Link } from "react-router-dom";
import { products, formatPrice } from "../data/products";
import logo from "/assets/logo.jpg";

export default function Home() {
  const featured = products.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">

            <img src={logo} alt="Basquiat" className="hero-logo" />
          <p className="hero-tagline">Wear the Crown. Own the Culture.</p>
          <Link to="/shop" className="hero-cta">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="section-header">
          <p className="section-label">Curated Selection</p>
          <h2 className="section-title">
            Featured <span>Pieces</span>
          </h2>
        </div>
        <div className="product-grid">
          {featured.map((product, i) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="product-card fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="product-card-img">
                <img src={product.images[0]} alt={product.name} />
                <span className="product-card-badge">{product.category}</span>
              </div>
              <div className="product-card-info">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-price">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link to="/shop" className="hero-cta" style={{
            opacity: 1,
            animation: "none",
            background: "var(--black)",
            color: "var(--gold)",
          }}>
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}