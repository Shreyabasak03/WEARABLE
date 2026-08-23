import api from "./api"; // adjust path if api instance is in ../api/api

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data.products || response.data;
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

export const getSingleProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.product || response.data;
};