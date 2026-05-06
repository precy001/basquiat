const BASE_URL = "http://localhost/basquiat/api";

function getToken() {
  return localStorage.getItem("basquiat_token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Auth
export const login = (username, password) =>
  request("auth", { method: "POST", body: JSON.stringify({ username, password }) });

// Products (public)
export const getProducts = () => request("products");
export const getProduct = (id) => request(`products/${id}`);

// Products (admin)
export const createProduct = (data) =>
  request("products", { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id, data) =>
  request(`products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id) =>
  request(`products/${id}`, { method: "DELETE" });

// Orders (public)
export const createOrder = (data) =>
  request("orders", { method: "POST", body: JSON.stringify(data) });

// Orders (admin)
export const getOrders = (status) =>
  request(`orders${status ? `?status=${status}` : ""}`);
export const getOrder = (id) => request(`orders/${id}`);
export const updateOrderStatus = (id, status) =>
  request(`orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
export const deleteOrder = (id) =>
  request(`orders/${id}`, { method: "DELETE" });

// Upload
export async function uploadImages(files) {
  const token = getToken();
  const formData = new FormData();
  for (const file of files) {
    formData.append("images[]", file);
  }
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data;
}

// Utility
export const formatPrice = (price) =>
  "₦" + Number(price).toLocaleString("en-NG");