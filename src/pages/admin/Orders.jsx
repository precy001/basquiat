import { useEffect, useState } from "react";
import { getOrders, getOrder, updateOrderStatus, deleteOrder } from "../../utils/api";

const formatPrice = (p) => "₦" + Number(p).toLocaleString("en-NG");
const statuses = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];
const assetUrl = (path) => path ? (path.startsWith("http") ? path : `https://dabyles.com.ng${path}`) : null;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getOrders(filter === "all" ? null : filter).then(setOrders).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchOrders(); }, [filter]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    try { setSelected(await getOrder(id)); } catch {} finally { setDetailLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      if (selected?.id === id) setSelected((s) => ({ ...s, status }));
      fetchOrders();
    } catch {}
  };

  const confirmOrder = async (id) => {
    await handleStatusChange(id, "confirmed");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order permanently?")) return;
    try { await deleteOrder(id); setSelected(null); fetchOrders(); } catch {}
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><p className="admin-eyebrow">Store management</p><h2 className="admin-page-title">Orders</h2><p className="admin-page-subtitle">Review customer details, payment proof and order contents.</p></div>
        <div className="admin-order-count">{orders.length} orders</div>
      </div>

      <div className="admin-filter-bar">
        {statuses.map((s) => <button key={s} className={`admin-filter-btn${filter === s ? " active" : ""}`} onClick={() => setFilter(s)}>{s}</button>)}
      </div>

      <div className="admin-card">
        {loading ? <p className="admin-empty">Loading orders...</p> : !orders.length ? <p className="admin-empty">No {filter !== "all" ? filter : ""} orders found.</p> :
          <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Contact</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Open</th></tr></thead>
            <tbody>{orders.map((order) => <tr key={order.id}>
              <td><strong className="order-number">#{order.id}</strong></td>
              <td><strong>{order.customer_name}</strong></td>
              <td><span>{order.customer_phone}</span><small className="table-sub">{order.customer_email || "No email"}</small></td>
              <td>{order.item_count}</td><td>{formatPrice(order.total_amount)}</td>
              <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
              <td>{new Date(order.created_at).toLocaleDateString("en-NG")}</td>
              <td><button className="order-open-btn" onClick={() => openDetail(order.id)}>Open order <span>→</span></button></td>
            </tr>)}</tbody>
          </table></div>}
      </div>

      {selected && <div className="modal-overlay" onClick={() => setSelected(null)}>
        <div className="modal modal-order-detail" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div><p className="admin-eyebrow">Customer order</p><h3>Order #{selected.id}</h3></div>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
          </div>
          <div className="modal-body">
            {detailLoading ? <p>Loading order...</p> : <>
              <div className="order-detail-top">
                <div><span className="detail-label">Status</span><span className={`status-badge status-${selected.status}`}>{selected.status}</span></div>
                <div><span className="detail-label">Placed</span><strong>{new Date(selected.created_at).toLocaleString("en-NG")}</strong></div>
                <div><span className="detail-label">Order total</span><strong className="detail-total">{formatPrice(selected.total_amount)}</strong></div>
              </div>

              <div className="order-detail-grid">
                <section className="detail-panel"><div className="detail-panel-title">Customer</div>
                  <p><strong>{selected.customer_name}</strong></p><p>{selected.customer_phone}</p><p>{selected.customer_email || "No email provided"}</p>
                </section>
                <section className="detail-panel"><div className="detail-panel-title">Delivery</div>
                  <p>{selected.delivery_address}</p>{selected.order_note && <p className="detail-note"><strong>Note:</strong> {selected.order_note}</p>}
                </section>
              </div>

              <section className="detail-panel detail-items-panel"><div className="detail-panel-title">Everything ordered</div>
                {selected.items?.map((item) => <div className="order-item-row" key={item.id}>
                  <div><strong>{item.product_name}</strong><span className="order-item-meta">{item.quantity} × {formatPrice(item.product_price)}</span></div>
                  <strong>{formatPrice(item.subtotal)}</strong>
                </div>)}
                <div className="order-item-row order-total-row"><strong>Total</strong><strong>{formatPrice(selected.total_amount)}</strong></div>
              </section>

              <section className="detail-panel payment-proof">
                <div><div className="detail-panel-title">Payment receipt</div><p className="table-sub">Proof submitted by the customer.</p></div>
                {selected.payment_receipt ? (
                  <a className="receipt-view" href={assetUrl(selected.payment_receipt)} target="_blank" rel="noreferrer">
                    {selected.payment_receipt.toLowerCase().endsWith(".pdf") ? <span className="receipt-pdf">PDF</span> : <img src={assetUrl(selected.payment_receipt)} alt="Payment receipt" />}
                    <span>Open receipt ↗</span>
                  </a>
                ) : <div className="receipt-missing">No payment receipt attached.</div>}
              </section>

              <div className="order-detail-actions">
                {selected.status === "pending" && <button className="confirm-order-btn" onClick={() => confirmOrder(selected.id)}>✓ Confirm order</button>}
                <button className="modal-cancel-btn" onClick={() => setSelected(null)}>Close</button>
                <button className="action-text-danger" onClick={() => handleDelete(selected.id)}>Delete order</button>
              </div>
            </>}
          </div>
        </div>
      </div>}
    </div>
  );
}
