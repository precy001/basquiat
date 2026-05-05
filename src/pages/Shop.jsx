import { useState } from "react";
import { Link } from "react-router-dom";
import { products, categories, formatPrice } from "../data/products";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="page-spacer">
      <section className="section">
        <div className="section-header">
          <p className="section-label">The Collection</p>
          <h2 className="section-title">
            All <span>Bags</span>
          </h2>
        </div>

        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No products found in this category.</div>
        ) : (
          <div className="product-grid">
            {filtered.map((product, i) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="product-card fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
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
      </section>
    </div>
  );
}