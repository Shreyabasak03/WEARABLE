import React, { useState } from "react";
import {
  X,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

export default function ProductDetails({
  product,
  onClose,
}) {
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

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

  if (!product) {
    return null;
  }

  return (
    <div className="product-modal-overlay">

      <div className="product-modal">

        {/* Close */}
        <button
          className="modal-close"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Image */}
        <div className="details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Details */}
        <div className="details-content">

          <p className="details-category">
            {product.category}
          </p>

          <h2>{product.name}</h2>

          <p className="details-brand">
            {product.brand}
          </p>

          <h3 className="details-price">
            ${Number(product.price).toFixed(2)}
          </h3>

          <p className="details-description">
            {product.description}
          </p>

          {/* Size */}
          <div className="details-section">
            <h4>Available Sizes</h4>

            <div className="size-list">
              {product.sizes?.map((size) => (
                <span key={size}>
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="details-section">
            <h4>Color</h4>

            <p>
              {product.colors?.join(", ")}
            </p>
          </div>

          {/* Quantity */}
          <div className="quantity-section">

            <h4>Quantity</h4>

            <div className="quantity-control">

              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
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

          {/* Buttons */}
          <div className="details-actions">

            <button className="wishlist-btn">
              <Heart size={20} />
            </button>

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

          </div>

          {/* Stock */}
          <p className="stock-info">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

        </div>

      </div>

    </div>
  );
}