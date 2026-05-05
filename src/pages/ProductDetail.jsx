import { useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "../data/products";

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
  const product = products.find((p) => p.id === Number(id));
  const [ordered, setOrdered] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrdered(true);
    // In production, send to backend/API here
  };

  const isValid = form.name && form.phone && form.address;

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

          <div className="order-form">
            {ordered ? (
              <div className="order-success">
                <div className="order-success-icon">✓</div>
                <h3>Order Placed!</h3>
                <p>
                  Thank you, {form.name}. We&apos;ll reach out to confirm your
                  order for the <strong>{product.name}</strong>.
                </p>
              </div>
            ) : (
              <>
                <h3 className="order-form-title">Place Your Order</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        className="form-input"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        className="form-input"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 0801 234 5678"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com (optional)"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Address *</label>
                    <textarea
                      className="form-textarea"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Full delivery address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Order Note</label>
                    <textarea
                      className="form-textarea"
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Any special requests? (optional)"
                      rows={2}
                    />
                  </div>
                  <button
                    type="submit"
                    className="order-btn"
                    disabled={!isValid}
                  >
                    Order Now — {formatPrice(product.price)}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}