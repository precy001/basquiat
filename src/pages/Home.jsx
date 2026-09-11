import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, formatPrice } from "../utils/api";

const instagramUrl = "https://www.instagram.com/basquiatng/";

function ProductStrip({ title, label, products }) {
  return (
    <section className="section home-product-section" id="collections">
      <div className="section-header home-section-header">
        <p className="section-label">{label}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="product-grid">
        {products.map((product, i) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="product-card-img">
              <img src={product.images?.[0]} alt={product.name} loading="lazy" />
              {product.images?.[1] && <img className="product-card-hover-img" src={product.images[1]} alt="" aria-hidden="true" loading="lazy" />}
              <span className="product-card-badge">{product.category}</span>
              <button className="card-wishlist" type="button" aria-label={`Add ${product.name} to wishlist`} onClick={(e) => e.preventDefault()}>♡</button>
            </div>
            <div className="product-card-info">
              <h3 className="product-card-name">{product.name}</h3>
              <p className="product-card-price">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const newDrop = products.slice(0, 4);
  const bestSellers = products.slice(4, 8).length ? products.slice(4, 8) : products.slice(0, 4);

  return (
    <>
      <section className="hero hero-campaign">
        <div className="hero-campaign-image" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="brand-lockup hero-brand-lockup">
            <div className="brand-main">BASQUIAT</div>
            <div className="brand-line" />
            <div className="brand-subb">IN GOD WE TRUST</div>
          </div>
          <p className="hero-tagline">A new expression of everyday luxury.</p>
          <Link to="/shop" className="hero-cta">Shop New Collection</Link>
        </div>
        <div className="hero-scroll">Scroll to explore <span>↓</span></div>
      </section>

      {newDrop.length > 0 && <ProductStrip title="New Drop" label="Latest collection" products={newDrop} />}

      <section className="editorial-banner" id="world">
        <div className="editorial-copy">
          <p className="section-label">The Basquiat World</p>
          <h2>More than what you wear.</h2>
          <p>Culture, movement and quiet confidence. BASQUIAT is made for people who turn everyday moments into their own statement.</p>
          <Link to="/shop" className="text-link">Explore the world <span>↗</span></Link>
        </div>
        <div className="editorial-art">
          <span>IN GOD<br />WE TRUST</span>
        </div>
      </section>

      {bestSellers.length > 0 && <ProductStrip title="Best Sellers" label="The pieces people keep coming back to" products={bestSellers} />}\n      {products.slice(8, 12).length > 0 && <ProductStrip title="Just In" label="Freshly added" products={products.slice(8, 12)} />}

      <section className="shop-look">
        <div className="shop-look-copy">
          <p className="section-label">Shop the Look</p>
          <h2>Style it your way.</h2>
          <p>Build a complete look from the latest BASQUIAT pieces.</p>
          <Link to="/shop" className="hero-cta dark-cta">Shop the collection</Link>
        </div>
        <div className="shop-look-grid">
          {products.slice(0, 3).map((product) => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <img src={product.images?.[0]} alt={product.name} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      <section className="instagram-section">
        <div className="section-header home-section-header">
          <p className="section-label">In God We Trust</p>
          <h2 className="section-title">@basquiatng</h2>
        </div>
        <a href={instagramUrl} target="_blank" rel="noreferrer" className="instagram-link">
          Follow us on Instagram <span>↗</span>
        </a>
      </section>
    </>
  );
}
