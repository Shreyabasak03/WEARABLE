import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/cartContext.jsx";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">

        <ShoppingBag size={70} />

        <h2>Your Cart is Empty</h2>

        <p>
          Looks like you haven't added anything
          to your cart yet.
        </p>

        <Link
          to="/men"
          className="continue-shopping"
        >
          Continue Shopping
        </Link>

      </div>
    );
  }


  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="cart-header">

          <div>

            <h1>
              Your Shopping Cart
            </h1>

            <p>
              {cartItems.length} product(s)
              {" "}in your cart
            </p>

          </div>


          <button
            className="clear-cart"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>


        <div className="cart-content">

          {/* ====================================
              PRODUCTS
          ==================================== */}

          <div className="cart-products">

            {cartItems.map((item) => (

              <div
                className="cart-item"
                key={item.id || item._id}
              >

                {/* IMAGE */}

                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />


                {/* DETAILS */}

                <div className="cart-item-details">

                  <h3>
                    {item.name}
                  </h3>


                  <p className="cart-category">
                    {item.category}
                  </p>


                  <p className="cart-price">
                    ₹
                    {Number(item.price).toLocaleString(
                      "en-IN"
                    )}
                  </p>


                  {/* QUANTITY */}

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id || item._id
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id || item._id
                        )
                      }
                      disabled={
                        item.quantity >= item.stock
                      }
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                </div>


                {/* =================================
                    RIGHT SIDE
                ================================= */}

                <div className="cart-item-right">

                  <p className="item-total">

                    ₹
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toLocaleString("en-IN")}

                  </p>


                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(
                        item.id || item._id
                      )
                    }
                  >
                    <Trash2 size={20} />
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* ====================================
              ORDER SUMMARY
          ==================================== */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {Number(totalPrice).toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Shipping
              </span>

              <span>
                Free
              </span>

            </div>


            <div className="summary-line"></div>


            <div className="summary-total">

              <span>
                Total
              </span>

              <span>
                ₹
                {Number(totalPrice).toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


            {/* CHECKOUT */}

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
            </button>


            {/* CONTINUE SHOPPING */}

            <Link
              to="/men"
              className="continue-link"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}