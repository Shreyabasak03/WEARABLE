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

export default function ProductDetails({
  product,
  onClose,
}) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState("");

  const { addToCart: addProductToCart } = useCart();

  // ==========================================
  // SET INITIAL IMAGE
  // ==========================================

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || "");
      setQuantity(1);
    }
  }, [product]);


  if (!product) return null;


  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };


  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };


  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    addProductToCart(product, quantity);

    onClose();
  };


  return (
    <div
      className="product-modal-overlay"
      onClick={onClose}
    >

      <div
        className="product-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ======================================
            CLOSE BUTTON
        ====================================== */}

        <button
          className="modal-close"
          onClick={onClose}
        >
          <X size={22} />
        </button>


        {/* ======================================
            PRODUCT IMAGE
        ====================================== */}

        <div className="details-image">

          <img
            src={selectedImage}
            alt={product.name}
          />

        </div>


        {/* ======================================
            PRODUCT DETAILS
        ====================================== */}

        <div className="details-content">

          {/* CATEGORY */}

          <p className="details-category">
            {product.category}
          </p>


          {/* NAME */}

          <h2>
            {product.name}
          </h2>


          {/* BRAND */}

          {product.brand && (
            <p className="details-brand">
              {product.brand}
            </p>
          )}


          {/* ====================================
              RATING
          ==================================== */}

          <div className="details-rating">

            <Star
              size={18}
              fill="#FFD700"
              color="#FFD700"
            />

            <span>
              {product.rating
                ? `${product.rating} / 5`
                : "No rating yet"}
            </span>

          </div>


          {/* ====================================
              PRICE
          ==================================== */}

          <h3 className="details-price">

            ₹
            {Number(product.price).toLocaleString(
              "en-IN"
            )}

          </h3>


          {/* DISCOUNT */}

          {product.discountPercentage > 0 && (
            <p className="details-discount">
              {product.discountPercentage}% OFF
            </p>
          )}


          {/* ====================================
              DESCRIPTION
          ==================================== */}

          <p className="details-description">
            {product.description}
          </p>


          {/* ====================================
              STOCK
          ==================================== */}

          <div className="details-section">

            <h4>
              Available Stock
            </h4>

            <p className="stock-count">

              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}

            </p>

          </div>


          {/* ====================================
              SIZES
          ==================================== */}

          {product.sizes?.length > 0 && (

            <div className="details-section">

              <h4>
                Available Sizes
              </h4>

              <div className="product-options">

                {product.sizes.map(
                  (size) => (
                    <span
                      key={size}
                      className="option-tag"
                    >
                      {size}
                    </span>
                  )
                )}

              </div>

            </div>

          )}


          {/* ====================================
              COLORS
          ==================================== */}

          {product.colors?.length > 0 && (

            <div className="details-section">

              <h4>
                Available Colors
              </h4>

              <div className="product-options">

                {product.colors.map(
                  (color) => (
                    <span
                      key={color}
                      className="option-tag"
                    >
                      {color}
                    </span>
                  )
                )}

              </div>

            </div>

          )}


          {/* ====================================
              QUANTITY
          ==================================== */}

          {product.stock > 0 && (

            <div className="quantity-section">

              <h4>
                Quantity
              </h4>

              <div className="quantity-control">

                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>


                <span>
                  {quantity}
                </span>


                <button
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>

          )}


          {/* ====================================
              ACTIONS
          ==================================== */}

          <div className="details-actions">

            <button
              className="wishlist-btn"
              title="Add to Wishlist"
            >
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

        </div>

      </div>

    </div>
  );
}