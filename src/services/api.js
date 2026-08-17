// services/api.js

import axios from "axios";

const API_URL = "http://localhost:5001/api/products";

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getProducts = async () => {
  const response = await axios.get(API_URL);

  return response.data.products;
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

export const getSingleProduct = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data.product;
};