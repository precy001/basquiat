import { useState } from "react";
import { Link } from "react-router-dom";
import { products, categories, formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    showToast(`${product.name} added to cart`);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleClearSearch = () => {
    setSearch("");
    setActiveCategory("All");
  };

  return (
    <div className="page-spacer">
      <section className="section">
        <div className="section-header">
          <p className="section-label">The Collection</p>
          <h2 className="section-title">
            All <span>Bags</span>
          </h2>
        </div>

        {/* Search bar */}
        <div className="search-bar-wrap">
          <div className="search-bar">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search bags by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
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

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p style={{ marginBottom: 12 }}>
              No bags found{search ? ` for "${search}"` : " in this category"}.
            </p>
            <button
              className="filter-btn active"
              onClick={handleClearSearch}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {search && (
              <p className="search-results-count">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
              </p>
            )}
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
                    <button
                      className={`card-add-btn${addedId === product.id ? " added" : ""}`}
                      onClick={(e) => handleAdd(e, product)}
                    >
                      {addedId === product.id ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      )}
                    </button>
                  </div>
                  <div className="product-card-info">
                    <h3 className="product-card-name">{product.name}</h3>
                    <p className="product-card-price">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}