import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

import { Search, Plus, Package, Edit, Trash2, Eye } from "lucide-react";

import "./Products.css";

const Products = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET PRODUCTS FROM BACKEND
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/products");

      // console.log("Products received:", response.data);

      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);

      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH PRODUCTS WHEN PAGE LOADS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // PRODUCT STATUS
  // ==========================================

  const getProductStatus = (stock) => {
    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 10) {
      return "Low Stock";
    }

    return "Active";
  };

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/products/${productId}`);

      // Remove the product from the current UI
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId),
      );
    } catch (err) {
      console.error("Failed to delete product:", err);

      alert(err.response?.data?.message || "Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const status = getProductStatus(product.stock);

    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All Categories" ||
      product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All Status" || status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-header">
          <div>
            <h1>Products</h1>

            <p>Manage your store products and inventory.</p>
          </div>
        </div>

        <div className="products-card">
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="products-page">
        <div className="products-header">
          <div>
            <h1>Products</h1>

            <p>Manage your store products and inventory.</p>
          </div>

          <button className="add-product-button" onClick={fetchProducts}>
            Retry
          </button>
        </div>

        <div className="products-card">
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#e88d8d",
            }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="products-page">
      {/* HEADER */}

      <div className="products-header">
        <div>
          <h1>Products</h1>

          <p>Manage your store products and inventory.</p>
        </div>
        <button
          className="add-product-button"
          onClick={() => navigate("/admin/products/add")}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* PRODUCTS CARD */}

      <div className="products-card">
        {/* TOOLBAR */}

        <div className="products-toolbar">
          {/* SEARCH */}

          <div className="product-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTERS */}

          <div className="product-filters">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All Categories</option>

              <option>Men</option>

              <option>Women</option>

              <option>Accessories</option>

              <option>Children</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>

              <option>Active</option>

              <option>Low Stock</option>

              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        {/* TABLE */}

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>

                <th>Category</th>

                <th>Price</th>

                <th>Stock</th>

                <th>Status</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const status = getProductStatus(product.stock);

                  return (
                    <tr key={product._id}>
                      {/* PRODUCT */}

                      <td>
                        <div className="product-info">
                          <div className="product-image">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <Package size={20} />
                            )}
                          </div>

                          <div>
                            <h4>{product.name}</h4>

                            <span>
                              ID: #{product._id?.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        <span className="category-text">
                          {product.category}
                        </span>
                      </td>

                      {/* PRICE */}

                      <td>
                        <span className="product-price">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* STOCK */}

                      <td>
                        <span
                          className={`stock-value ${
                            product.stock <= 5
                              ? "stock-danger"
                              : product.stock <= 10
                                ? "stock-warning"
                                : ""
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`product-status ${status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="product-actions">
                          <button
                            title="View"
                            onClick={() =>
                              navigate(`/admin/products/view/${product._id}`)
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            title="Edit"
                            onClick={() =>
                              navigate(`/admin/products/edit/${product._id}`)
                            }
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            className="delete-action"
                            title="Delete"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                      color: "var(--text-muted)",
                    }}
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="products-footer">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>

          <div className="pagination">
            <button disabled>Previous</button>

            <button className="active-page">1</button>

            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
