import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, getProducts } from "../../utils/api";

const formatPrice = (p) => "₦" + Number(p).toLocaleString("en-NG");

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getProducts()]).then(([o, p]) => { setOrders(o); setProducts(p); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pending = orders.filter((o) => o.status === "pending");
  const confirmed = orders.filter((o) => o.status === "confirmed");
  const recent = orders.slice(0, 6);

  return <div className="admin-page">
    <div className="admin-welcome">
      <div><p className="admin-eyebrow">BASQUIAT / CONTROL CENTRE</p><h2 className="admin-page-title">Good to see you.</h2><p className="admin-page-subtitle">Keep an eye on orders, payments and the store.</p></div>
      <Link to="/admin/orders" className="admin-primary-btn">Review orders <span>→</span></Link>
    </div>

    <div className="admin-highlight">
      <div><span className="admin-highlight-label">Store revenue</span><strong>{formatPrice(totalRevenue)}</strong><small>Across non-cancelled orders</small></div>
      <div className="admin-highlight-mark">B</div>
    </div>

    <div className="stat-grid">
      <div className="stat-card"><div className="stat-icon stat-icon-orange">!</div><div><span className="stat-label">Pending review</span><span className="stat-value">{pending.length}</span><small>Need your attention</small></div></div>
      <div className="stat-card"><div className="stat-icon stat-icon-green">✓</div><div><span className="stat-label">Confirmed</span><span className="stat-value">{confirmed.length}</span><small>Ready for fulfilment</small></div></div>
      <div className="stat-card"><div className="stat-icon stat-icon-gold">₦</div><div><span className="stat-label">Average order</span><span className="stat-value">{formatPrice(orders.length ? totalRevenue / orders.length : 0)}</span><small>Per non-cancelled order</small></div></div>
      <div className="stat-card"><div className="stat-icon stat-icon-blue">□</div><div><span className="stat-label">Products</span><span className="stat-value">{products.length}</span><small>In your catalogue</small></div></div>
    </div>

    <div className="admin-dashboard-grid">
      <div className="admin-card">
        <div className="admin-card-header"><div><p className="admin-eyebrow">Latest activity</p><h3>Recent orders</h3></div><Link to="/admin/orders" className="admin-card-link">View all →</Link></div>
        {!recent.length ? <p className="admin-empty">No orders yet.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>
          {recent.map((o) => <tr key={o.id}><td><strong>#{o.id}</strong></td><td>{o.customer_name}<small className="table-sub">{o.customer_phone}</small></td><td>{formatPrice(o.total_amount)}</td><td><span className={`status-badge status-${o.status}`}>{o.status}</span></td><td><Link className="order-open-btn" to="/admin/orders">Open →</Link></td></tr>)}
        </tbody></table></div>}
      </div>
      <div className="admin-card admin-attention-card">
        <div className="admin-card-header"><div><p className="admin-eyebrow">Action required</p><h3>Pending orders</h3></div></div>
        {pending.length ? pending.slice(0, 4).map((o) => <Link to="/admin/orders" className="attention-row" key={o.id}><span className="attention-number">#{o.id}</span><span><strong>{o.customer_name}</strong><small>{o.item_count} item{o.item_count > 1 ? "s" : ""} · {formatPrice(o.total_amount)}</small></span><span>→</span></Link>) : <p className="admin-empty">You're all caught up.</p>}
      </div>
    </div>
  </div>;
}
