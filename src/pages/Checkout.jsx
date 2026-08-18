import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

import { useCart } from "../context/cartContext.jsx";
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
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById(
        "razorpay-script"
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.id = "razorpay-script";
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // CREATE ORDER IN YOUR DATABASE
  // =====================================================

  const createDatabaseOrder = async ({
    paymentMethod,
    razorpayOrderId = null,
    razorpayPaymentId = null,
  }) => {
    const orderData = {
      products: cartItems.map((item) => ({
        product: item.id,
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: item.quantity,
      })),

      customer: {
        name: "Guest Customer",
        email: "guest@example.com",
        phone: "0000000000",
      },

      shippingAddress: {
        address: "Not provided",
        city: "Not provided",
        state: "Not provided",
        pincode: "000000",
      },

      paymentMethod,

      totalAmount: Number(totalPrice),

      status:
        paymentMethod === "COD"
          ? "Pending"
          : "Confirmed",

      razorpayOrderId,
      razorpayPaymentId,
    };

    const response = await axios.post(
      "http://localhost:5001/api/orders",
      orderData
    );

    return response.data;
  };

  // =====================================================
  // ONLINE PAYMENT
  // =====================================================

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);

      // ---------------------------------------------
      // Load Razorpay
      // ---------------------------------------------

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        alert(
          "Razorpay failed to load. Please check your internet connection."
        );

        setLoading(false);
        return;
      }

      // ---------------------------------------------
      // Create Razorpay order from backend
      // ---------------------------------------------

      const response = await axios.post(
        "http://localhost:5001/api/payment/create-order",
        {
          amount: totalPrice,
        }
      );

      const razorpayOrder = response.data.order;

      // ---------------------------------------------
      // Razorpay Checkout
      // ---------------------------------------------

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Wearable",

        description: "E-commerce Purchase",

        order_id: razorpayOrder.id,

        handler: async function (paymentResponse) {
          try {
            // ---------------------------------------
            // VERIFY PAYMENT
            // ---------------------------------------

            const verifyResponse = await axios.post(
              "http://localhost:5001/api/payment/verify",
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              }
            );

            if (!verifyResponse.data.success) {
              alert("Payment verification failed.");
              setLoading(false);
              return;
            }

            // ---------------------------------------
            // SAVE ORDER IN MONGODB
            // ---------------------------------------

            await createDatabaseOrder({
              paymentMethod:
                paymentMethod === "upi"
                  ? "UPI"
                  : "Card",

              razorpayOrderId:
                paymentResponse.razorpay_order_id,

              razorpayPaymentId:
                paymentResponse.razorpay_payment_id,
            });

            // ---------------------------------------
            // CLEAR CART
            // ---------------------------------------

            clearCart();

            setLoading(false);
            setOrderPlaced(true);

          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              "Payment was completed but order verification failed. Please contact support."
            );

            setLoading(false);
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          project: "Wearable Ecommerce",
        },

        theme: {
          color: "#2AAE9B",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

    } catch (error) {
      console.error(
        "Online payment error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  };

  // =====================================================
  // COD ORDER
  // =====================================================

  const handleCODOrder = async () => {
    try {
      setLoading(true);

      await createDatabaseOrder({
        paymentMethod: "COD",
      });

      clearCart();

      setLoading(false);
      setOrderPlaced(true);

    } catch (error) {
      console.error(
        "COD order error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to place order. Please try again."
      );

      setLoading(false);
    }
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "cod") {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty">

        <h2>Your cart is empty</h2>

        <button
          onClick={() => navigate("/men")}
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  // =====================================================
  // ORDER SUCCESS
  // =====================================================

  if (orderPlaced) {
    return (
      <div className="order-success">

        <CheckCircle size={70} />

        <h1>
          Order Placed Successfully!
        </h1>

        <p>
          Thank you for shopping with us.
        </p>

        <p>
          Your order has been successfully placed.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "25px",
          }}
        >

          <button
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // CHECKOUT UI
  // =====================================================

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        <h1>Checkout</h1>

        <div className="checkout-content">

          {/* =========================================
              LEFT SIDE
          ========================================= */}

          <div className="checkout-left">

            {/* ORDER ITEMS */}

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
                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* =====================================
                PAYMENT
            ===================================== */}

            <div className="checkout-section">

              <h2>
                Select Payment Method
              </h2>

              <div className="payment-options">

                {/* UPI */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "upi"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                  disabled={loading}
                >

                  <Smartphone size={25} />

                  <div>

                    <strong>UPI</strong>

                    <p>
                      Google Pay, PhonePe, Paytm
                    </p>

                  </div>

                </button>

                {/* CARD */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "card"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  disabled={loading}
                >

                  <CreditCard size={25} />

                  <div>

                    <strong>
                      Credit / Debit Card
                    </strong>

                    <p>
                      Visa, Mastercard, RuPay
                    </p>

                  </div>

                </button>

                {/* COD */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "cod"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  disabled={loading}
                >

                  <Banknote size={25} />

                  <div>

                    <strong>
                      Cash on Delivery
                    </strong>

                    <p>
                      Pay when your order arrives
                    </p>

                  </div>

                </button>

              </div>

            </div>

          </div>

          {/* =========================================
              RIGHT SIDE
          ========================================= */}

          <div className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>Subtotal</span>

              <span>
                ₹{totalPrice.toFixed(2)}
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
                ₹{totalPrice.toFixed(2)}
              </span>

            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >

              {loading
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Place Order"
                : "Pay Now"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}