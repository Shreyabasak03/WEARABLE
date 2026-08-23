import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  MapPin,
} from "lucide-react";

import api from "../api/Axios.js"; // Adjust import path if needed

import { useCart } from "../context/cartContext.jsx";
import { useAuth } from "../context/AuthContext";

import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const savedLocation =
      JSON.parse(localStorage.getItem("userLocation")) || null;

    if (savedLocation) {
      setShippingAddress((prev) => ({
        ...prev,
        city:
          savedLocation.city ||
          savedLocation.county ||
          savedLocation.town ||
          savedLocation.village ||
          "",
        state: savedLocation.state || "",
      }));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById("razorpay-script");

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const createDatabaseOrder = async ({
    paymentMethod,
    razorpayOrderId = null,
    razorpayPaymentId = null,
  }) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to place an order.");
      }

      const orderData = {
        products: cartItems.map((item) => ({
          product: item.id || item._id,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        customer: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
        },
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
        },
        paymentMethod,
        totalAmount: Number(totalPrice),
        status: paymentMethod === "COD" ? "Pending" : "Confirmed",
        razorpayOrderId,
        razorpayPaymentId,
      };

      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Create database order error:", error);
      throw error;
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        alert("Razorpay failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const response = await api.post("/payment/create-order", {
        amount: totalPrice,
      });

      const razorpayOrder = response.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Wearable",
        description: "E-commerce Purchase",
        order_id: razorpayOrder.id,
        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await api.post("/payment/verify", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (!verifyResponse.data.success) {
              alert("Payment verification failed.");
              setLoading(false);
              return;
            }

            await createDatabaseOrder({
              paymentMethod: paymentMethod === "upi" ? "UPI" : "Card",
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
            });

            clearCart();
            setLoading(false);
            setOrderPlaced(true);
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              error.response?.data?.message ||
                "Payment completed but order verification failed."
            );
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
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
      console.error("Online payment error:", error);
      alert(
        error.response?.data?.message ||
          "Unable to start payment. Please try again."
      );
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    try {
      setLoading(true);
      await createDatabaseOrder({ paymentMethod: "COD" });
      clearCart();
      setLoading(false);
      setOrderPlaced(true);
    } catch (error) {
      console.error("COD order error:", error);
      alert(
        error.response?.data?.message ||
          "Unable to place order. Please try again."
      );
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      alert("Please login before placing an order.");
      navigate("/login");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.phone.trim() ||
      !shippingAddress.email.trim() ||
      !shippingAddress.address.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.state.trim() ||
      !shippingAddress.pincode.trim()
    ) {
      alert("Please complete your shipping address");
      return;
    }

    if (
      shippingAddress.phone.length !== 10 ||
      !/^\d+$/.test(shippingAddress.phone)
    ) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (
      shippingAddress.pincode.length !== 6 ||
      !/^\d+$/.test(shippingAddress.pincode)
    ) {
      alert("Please enter a valid 6-digit PIN code");
      return;
    }

    if (paymentMethod === "cod") {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  if (authLoading) {
    return (
      <div className="checkout-empty">
        <h2>Checking login...</h2>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/men")}>Continue Shopping</button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="order-success">
        <CheckCircle size={70} />
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with us.</p>
        <p>Your order has been successfully placed.</p>
        <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
          <button onClick={() => navigate("/orders")}>View My Orders</button>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-left">
            <div className="checkout-section">
              <h2>Your Order</h2>
              {cartItems.map((item) => (
                <div className="checkout-item" key={item.id || item._id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-section">
              <h2>
                <MapPin size={20} />
                Shipping Address
              </h2>

              <div className="shipping-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      maxLength={10}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        address: e.target.value,
                      })
                    }
                    placeholder="House / Flat / Street / Area"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City / Area</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      placeholder="City / Area"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label>PIN Code</label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      maxLength={6}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          pincode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="6-digit PIN"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Select Payment Method</h2>
              <div className="payment-options">
                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "upi" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("upi")}
                  disabled={loading}
                >
                  <Smartphone size={25} />
                  <div>
                    <strong>UPI</strong>
                    <p>Google Pay, PhonePe, Paytm</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "card" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("card")}
                  disabled={loading}
                >
                  <CreditCard size={25} />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <p>Visa, Mastercard, RuPay</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "cod" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                  disabled={loading}
                >
                  <Banknote size={25} />
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order arrives</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{Number(totalPrice).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-line"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{Number(totalPrice).toFixed(2)}</span>
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