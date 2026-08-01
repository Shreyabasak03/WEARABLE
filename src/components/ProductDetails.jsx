import React, { useState, useEffect } from "react";
import {
  X,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Star,
} from "lucide-react";

import { useCart } from "../context/cartContext";
import "./ProductDetails.css";

export default function ProductDetails({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useCart();

  // Set initial image when product loads or changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail || product.images?.[0] || "");
    }
  }, [product]);

  if (!product) return null;

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  // Combine main thumbnail with extra images for complete gallery list
  const allImages = Array.from(
    new Set([product.thumbnail, ...(product.images || [])].filter(Boolean))
  );

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        {/* Main Display Image */}
        <div className="details-image">
          <img src={selectedImage} alt={product.title} />
        </div>

        {/* Details Content */}
        <div className="details-content">
          <p className="details-category">{product.category}</p>
          <h2>{product.title}</h2>
          <p className="details-brand">{product.brand}</p>

          {/* Rating */}
          <div className="details-rating">
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <span>{product.rating} / 5</span>
          </div>

          <h3 className="details-price">
            ${Number(product.price).toFixed(2)}
          </h3>

          <p className="details-description">{product.description}</p>

          {/* Available Stock */}
          <div className="details-section">
            <h4>Available Stock</h4>
            <p className="stock-count">{product.stock} items available</p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <h4>Quantity</h4>
            <div className="quantity-control">
              <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="details-actions">
            <button className="wishlist-btn" title="Add to Wishlist">
              <Heart size={20} />
            </button>

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Interactive Image Gallery */}
          {allImages.length > 1 && (
            <div className="details-section">
              <h4>More Images</h4>
              <div className="image-gallery">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    className={`gallery-item ${
                      selectedImage === img ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`${product.title} view ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}