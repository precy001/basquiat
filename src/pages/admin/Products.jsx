import { useState, useEffect, useRef } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
} from "../../utils/api";

const formatPrice = (p) => "₦" + Number(p).toLocaleString("en-NG");
const emptyForm = { name: "", price: "", category: "", description: "", images: [] };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const fileRef = useRef();

  const fetchProducts = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description || "",
      images: product.images || [],
    });
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    try {
      const data = await uploadImages(files);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.paths] }));
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category) {
      setError("Name, price, and category are required");
      return;
    }
    if (form.images.length === 0) {
      setError("Upload at least one image");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        description: form.description,
        images: form.images,
      };

      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct(payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {}
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Products</h2>
          <p className="admin-page-subtitle">{products.length} products</p>
        </div>
        <button className="admin-primary-btn" onClick={openAdd}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="admin-search-wrap">
        <input
          type="text"
          className="admin-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product grid */}
      {loading ? (
        <p className="admin-empty">Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-empty">No products found.</p>
      ) : (
        <div className="admin-product-grid">
          {filtered.map((product) => (
            <div key={product.id} className="admin-product-card">
              <div className="admin-product-img">
                <img src={product.images[0]} alt={product.name} />
              </div>
              <div className="admin-product-info">
                <h4>{product.name}</h4>
                <p className="admin-product-cat">{product.category}</p>
                <p className="admin-product-price">{formatPrice(product.price)}</p>
              </div>
              <div className="admin-product-actions">
                <button className="action-btn" onClick={() => openEdit(product)} title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button className="action-btn action-danger" onClick={() => handleDelete(product.id)} title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? "Edit Product" : "Add Product"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="modal-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="modal-form-row">
                  <div className="modal-field">
                    <label>Product Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Classic Leather Tote" required />
                  </div>
                  <div className="modal-field">
                    <label>Category *</label>
                    <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Tote, Clutch, Sling" required />
                  </div>
                </div>
                <div className="modal-field">
                  <label>Price (₦) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 25000" required />
                </div>
                <div className="modal-field">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." rows={3} />
                </div>

                {/* Image upload */}
                <div className="modal-field">
                  <label>Images *</label>
                  <div className="image-upload-area">
                    {form.images.map((src, i) => (
                      <div key={i} className="upload-thumb">
                        <img src={src} alt="" />
                        <button type="button" className="upload-thumb-remove" onClick={() => removeImage(i)}>×</button>
                      </div>
                    ))}
                    <label className="upload-add-btn">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        style={{ display: "none" }}
                      />
                      {uploading ? (
                        <span>Uploading...</span>
                      ) : (
                        <>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          <span>Upload</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="admin-primary-btn" disabled={saving}>
                    {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
