import { useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products, formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";

function ZoomGallery({ images }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const updateOrigin = useCallback((clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  }, []);

  const handleMouseEnter = (e) => {
    setZoomed(true);
    updateOrigin(e.clientX, e.clientY);
  };
  const handleMouseMove = (e) => zoomed && updateOrigin(e.clientX, e.clientY);
  const handleMouseLeave = () => setZoomed(false);
  const handleTouchStart = (e) => {
    e.preventDefault();
    setZoomed(true);
    updateOrigin(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    updateOrigin(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchEnd = () => setZoomed(false);

  return (
    <div className="gallery">
      <div
        ref={containerRef}
        className={`gallery-main${zoomed ? " zoomed" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imgRef}
          src={images[active]}
          alt="Product"
          draggable={false}
        />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, idx) => (
            <button
              key={idx}
              className={`gallery-thumb${active === idx ? " active" : ""}`}
              onClick={() => setActive(idx)}
            >
              <img src={src} alt={`View ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart, items } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.find((item) => item.id === product?.id);

  if (!product) {
    return (
      <div className="page-spacer empty-state">
        <p>Product not found.</p>
        <Link to="/shop" style={{ color: "var(--gold)", marginTop: 12, display: "inline-block" }}>
          ← Back to shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    setJustAdded(true);
    showToast(`${qty} × ${product.name} added to cart`);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    showToast(`${product.name} added — redirecting to cart`);
    navigate("/cart");
  };

  return (
    <div className="detail-page">
      <div className="detail-back">
        <Link to="/shop">← Back to collection</Link>
      </div>

      <div className="detail-layout">
        <ZoomGallery images={product.images} />

        <div className="detail-info">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <div className="detail-divider" />
          <p className="detail-desc">{product.description}</p>

          <div className="qty-section">
            <label className="form-label">Quantity</label>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <span className="qty-subtotal">{formatPrice(product.price * qty)}</span>
          </div>

          <div className="detail-actions">
            <button
              className={`add-cart-btn${justAdded ? " added" : ""}`}
              onClick={handleAddToCart}
            >
              {justAdded ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  Add to Cart
                </>
              )}
            </button>
            <button className="order-btn" onClick={handleBuyNow}>
              Order Now — {formatPrice(product.price * qty)}
            </button>
          </div>

          {inCart && !justAdded && (
            <p className="in-cart-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {inCart.quantity} already in your cart ·{" "}
              <Link to="/cart">View Cart</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}