import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, formatPrice } from "../utils/api";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((products) => setFeatured(products.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 80px)",
            fontWeight: 800,
            color: "var(--gold)",
            letterSpacing: "6px",
            lineHeight: 1.1,
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            Basquiat.
          </h1>
          <p className="hero-tagline">Wear the Crown. Own the Culture.</p>
          <Link to="/shop" className="hero-cta">Shop Collection</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <p className="section-label">Curated Selection</p>
          <h2 className="section-title">Featured <span>Pieces</span></h2>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--gray-500)" }}>Loading products...</p>
        ) : (
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
        )}

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link to="/shop" className="hero-cta" style={{
            opacity: 1, animation: "none",
            background: "var(--camo-dark)", color: "var(--gold)",
          }}>
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}