import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // For now, simulate order placement
    setOrderPlaced(true);

    // Clear cart after successful order
    clearCart();
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>

        <button onClick={() => navigate("/men")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="order-success">

        <CheckCircle size={70} />

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you for shopping with us.
        </p>

        <p>
          Your order has been successfully placed.
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        <h1>Checkout</h1>

        <div className="checkout-content">

          {/* LEFT SIDE */}
          <div className="checkout-left">

            {/* Order Items */}
            <div className="checkout-section">

              <h2>Your Order</h2>

              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      ${(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>

                </div>
              ))}

            </div>


            {/* Payment */}
            <div className="checkout-section">

              <h2>Select Payment Method</h2>

              <div className="payment-options">

                {/* UPI */}
                <button
                  className={`payment-option ${
                    paymentMethod === "upi"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                >
                  <Smartphone size={25} />

                  <div>
                    <strong>UPI</strong>
                    <p>
                      Google Pay, PhonePe, Paytm
                    </p>
                  </div>

                </button>


                {/* Card */}
                <button
                  className={`payment-option ${
                    paymentMethod === "card"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                >
                  <CreditCard size={25} />

                  <div>
                    <strong>Credit / Debit Card</strong>

                    <p>
                      Visa, Mastercard, RuPay
                    </p>
                  </div>

                </button>


                {/* COD */}
                <button
                  className={`payment-option ${
                    paymentMethod === "cod"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                >
                  <Banknote size={25} />

                  <div>
                    <strong>Cash on Delivery</strong>

                    <p>
                      Pay when your order arrives
                    </p>
                  </div>

                </button>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <span>Free</span>
            </div>

            <div className="summary-line"></div>

            <div className="summary-total">
              <span>Total</span>

              <span>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}