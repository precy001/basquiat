// Product data now comes from the API
// This file only exports utility functions

export const formatPrice = (price) =>
  "₦" + Number(price).toLocaleString("en-NG");

export const getCategories = (products) =>
  ["All", ...new Set(products.map((p) => p.category))];