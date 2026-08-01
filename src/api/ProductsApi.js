import axios from "axios";

const API = axios.create({
  baseURL: "https://dummyjson.com/products",
});

// Get all products
export const getAllProducts = async () => {
  const res = await API.get("?limit=100");
  return res.data.products;
};

// Get product by ID
export const getProductById = async (id) => {
  const res = await API.get(`/${id}`);
  return res.data;
};

// Get category products
export const getProductsByCategory = async (category) => {
  const res = await API.get(`/category/${category}`);
  return res.data.products;
};

// Search
export const searchProducts = async (query) => {
  const res = await API.get(`/search?q=${query}`);
  return res.data.products;
};

// Categories
export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};
export const getProductsByCategory = async (category) => {
  const res = await API.get(`/category/${category}`);
  return res.data.products;
};
export const getProductsByCategory = async (category) => {
  const res = await API.get(`/category/${category}`);
  return res.data.products;
};