import { useState, useEffect } from "react";
import { getOrders, getOrder, updateOrderStatus, deleteOrder } from "../../utils/api";

const formatPrice = (p) => "₦" + Number(p).toLocaleString("en-NG");
const statuses = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getOrders(filter === "all" ? null : filter)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const order = await getOrder(id);
      setSelected(order);
    } catch {}
    setDetailLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      if (selected && selected.id === id) {
        setSelected({ ...selected, status });
      }
      fetchOrders();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await deleteOrder(id);
      setSelected(null);
      fetchOrders();
    } catch {}
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Orders</h2>
        <p className="admin-page-subtitle">{orders.length} total orders</p>
      </div>

      {/* Status filter */}
      <div className="admin-filter-bar">
        {statuses.map((s) => (
          <button
            key={s}
            className={`admin-filter-btn${filter === s ? " active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">No {filter !== "all" ? filter : ""} orders found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_phone}</td>
                    <td>{order.item_count}</td>
                    <td>{formatPrice(order.total_amount)}</td>
                    <td>
                      <select
                        className={`status-select status-${order.status}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {statuses.filter((s) => s !== "all").map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="action-btn" onClick={() => openDetail(order.id)} title="View details">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="action-btn action-danger" onClick={() => handleDelete(order.id)} title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order #{selected.id}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              {detailLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="detail-grid">
                    <div>
                      <span className="detail-label">Customer</span>
                      <p>{selected.customer_name}</p>
                    </div>
                    <div>
                      <span className="detail-label">Phone</span>
                      <p>{selected.customer_phone}</p>
                    </div>
                    <div>
                      <span className="detail-label">Email</span>
                      <p>{selected.customer_email || "—"}</p>
                    </div>
                    <div>
                      <span className="detail-label">Status</span>
                      <p><span className={`status-badge status-${selected.status}`}>{selected.status}</span></p>
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <span className="detail-label">Delivery Address</span>
                    <p>{selected.delivery_address}</p>
                  </div>
                  {selected.order_note && (
                    <div style={{ marginTop: 12 }}>
                      <span className="detail-label">Note</span>
                      <p>{selected.order_note}</p>
                    </div>
                  )}

                  <h4 style={{ marginTop: 24, marginBottom: 12 }}>Items Ordered</h4>
                  <div className="order-items-list">
                    {selected.items?.map((item) => (
                      <div key={item.id} className="order-item-row">
                        <div>
                          <strong>{item.product_name}</strong>
                          <span className="order-item-meta">× {item.quantity}</span>
                        </div>
                        <span>{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}
                    <div className="order-item-row order-total-row">
                      <strong>Total</strong>
                      <strong>{formatPrice(selected.total_amount)}</strong>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
