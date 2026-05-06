import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isValid = form.name && form.phone && form.address;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send order data to backend here
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="page-spacer">
        <div className="cart-page">
          <div className="order-success" style={{ marginTop: 40 }}>
            <div className="order-success-icon">✓</div>
            <h3>Order Placed Successfully!</h3>
            <p style={{ marginBottom: 16 }}>
              Thank you, <strong>{form.name}</strong>. We&apos;ll reach out to confirm
              your order of {totalItems} item{totalItems > 1 ? "s" : ""} totalling{" "}
              <strong>{formatPrice(totalPrice)}</strong>.
            </p>
            <div className="order-success-summary">
              {items.map((item) => (
                <div key={item.id} className="order-success-item">
                  <img src={item.images[0]} alt={item.name} />
                  <div>
                    <p className="order-success-item-name">{item.name}</p>
                    <p className="order-success-item-detail">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/shop"
              className="order-btn"
              style={{ display: "block", textAlign: "center", marginTop: 24 }}
              onClick={() => {
                clearCart();
                setOrdered(false);
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-spacer">
        <div className="cart-page">
          <div className="section-header" style={{ marginTop: 24 }}>
            <p className="section-label">Your Bag</p>
            <h2 className="section-title">
              Your Cart is <span>Empty</span>
            </h2>
          </div>
          <div className="empty-state">
            <p style={{ marginBottom: 24 }}>
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              to="/shop"
              className="hero-cta"
              style={{ opacity: 1, animation: "none", background: "var(--black)", color: "var(--gold)" }}
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-spacer">
      <div className="cart-page">
        <div className="section-header" style={{ marginTop: 24 }}>
          <p className="section-label">Your Bag</p>
          <h2 className="section-title">
            Shopping <span>Cart</span>
          </h2>
        </div>

        <div className="cart-layout">
          {/* Cart items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <Link to={`/product/${item.id}`} className="cart-item-img">
                  <img src={item.images[0]} alt={item.name} />
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <Link to={`/product/${item.id}`} className="cart-item-name">
                        {item.name}
                      </Link>
                      <p className="cart-item-category">{item.category}</p>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {/* Order summary + form */}
          <div className="cart-sidebar">
            <div className="cart-summary">
              <h3 className="cart-summary-title">Order Summary</h3>

              <div className="cart-summary-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-summary-row">
                    <span>
                      {item.name}
                      <span className="cart-summary-qty"> × {item.quantity}</span>
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="cart-summary-total">
                <span>Total ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="order-form" style={{ border: "none", padding: "0", marginTop: 24 }}>
              <h3 className="order-form-title">Delivery Details</h3>
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
                <button type="submit" className="order-btn" disabled={!isValid}>
                  Place Order — {formatPrice(totalPrice)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}