import React, { useState } from "react";
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

export default function ProductDetails({
  product,
  onClose,
}) {
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

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
            src={product.thumbnail}
            alt={product.title}
          />
        </div>

        {/* Details */}
        <div className="details-content">

          <p className="details-category">
            {product.category}
          </p>

          <h2>{product.title}</h2>

          <p className="details-brand">
            {product.brand}
          </p>

          {/* Rating */}
          <div className="details-rating">

            <Star
              size={18}
              fill="#FFD700"
              color="#FFD700"
            />

            <span>{product.rating} / 5</span>

          </div>

          <h3 className="details-price">
            ${Number(product.price).toFixed(2)}
          </h3>

          <p className="details-description">
            {product.description}
          </p>

          {/* Stock */}
          <div className="details-section">

            <h4>Available Stock</h4>

            <p>{product.stock} items available</p>

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

          <p className="stock-info">

            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of Stock"}

          </p>

          {/* More Images */}
          {product.images?.length > 1 && (

            <div className="details-section">

              <h4>More Images</h4>

              <div className="image-gallery">

                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={product.title}
                    className="gallery-image"
                  />
                ))}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}