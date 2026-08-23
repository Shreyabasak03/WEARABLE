import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { ArrowLeft, Package } from "lucide-react";

import "./ViewProduct.css";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`, {
          withCredentials: true,
        });

        setProduct(response.data.product);
      } catch (err) {
        console.error("Failed to fetch product:", err);

        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="view-product-page">
        <div className="view-product-message">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-product-page">
        <div className="view-product-message error">{error}</div>

        <button
          className="back-button"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const status =
    product.stock === 0
      ? "Out of Stock"
      : product.stock <= 10
        ? "Low Stock"
        : "Active";

  return (
    <div className="view-product-page">
      {/* HEADER */}

      <div className="view-product-header">
        <button
          className="back-button"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        <div>
          <h1>Product Details</h1>

          <p>View complete information about this product.</p>
        </div>
      </div>

      {/* PRODUCT CARD */}

      <div className="view-product-card">
        {/* IMAGE */}

        <div className="view-product-image-section">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="no-product-image">
              <Package size={60} />
            </div>
          )}
        </div>

        {/* DETAILS */}

        <div className="view-product-details">
          <div className="product-title-row">
            <div>
              <span className="product-id">
                ID: #{product._id.slice(-6).toUpperCase()}
              </span>

              <h2>{product.name}</h2>

              {product.brand && (
                <p className="product-brand">{product.brand}</p>
              )}
            </div>

            <span
              className={`product-status ${status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {status}
            </span>
          </div>

          {/* PRICE */}

          <div className="product-price-box">
            <span>Price</span>

            <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
          </div>

          {/* INFORMATION GRID */}

          <div className="product-info-grid">
            <div>
              <span>Category</span>
              <strong>{product.category}</strong>
            </div>

            <div>
              <span>Stock</span>
              <strong>{product.stock}</strong>
            </div>

            <div>
              <span>Discount</span>
              <strong>{product.discountPercentage || 0}%</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{product.isActive ? "Active" : "Inactive"}</strong>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="product-description">
            <h3>Description</h3>

            <p>{product.description || "No description available."}</p>
          </div>

          {/* SIZES */}

          {product.sizes?.length > 0 && (
            <div className="product-options">
              <h3>Available Sizes</h3>

              <div className="option-list">
                {product.sizes.map((size, index) => (
                  <span key={index}>{size}</span>
                ))}
              </div>
            </div>
          )}

          {/* COLORS */}

          {product.colors?.length > 0 && (
            <div className="product-options">
              <h3>Available Colors</h3>

              <div className="option-list">
                {product.colors.map((color, index) => (
                  <span key={index}>{color}</span>
                ))}
              </div>
            </div>
          )}

          {/* ACTION */}

          <div className="view-product-actions">
            <button
              className="edit-product-button"
              onClick={() => navigate(`/admin/products/edit/${product._id}`)}
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
