import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/products",
});

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getAllProducts = async () => {
  const res = await API.get("/");

  return res.data.products;
};


// ==========================================
// GET PRODUCT BY ID
// ==========================================

export const getProductById = async (id) => {
  const res = await API.get(`/${id}`);

  return res.data.product;
};


// ==========================================
// GET PRODUCTS BY CATEGORY
// ==========================================

export const getProductsByCategory = async (category) => {
  const res = await API.get("/");

  const products = res.data.products;

  return products.filter(
    (product) =>
      product.category.toLowerCase() ===
      category.toLowerCase()
  );
};


// ==========================================
// SEARCH PRODUCTS
// ==========================================

export const searchProducts = async (query) => {
  const res = await API.get("/");

  const products = res.data.products;

  return products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(query.toLowerCase())
  );
};


// ==========================================
// GET CATEGORIES
// ==========================================

export const getCategories = async () => {
  const res = await API.get("/");

  const products = res.data.products;

  const categories = [
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  return categories;
};