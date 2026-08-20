import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  MapPin,
} from "lucide-react";

import axios from "axios";

import { useCart } from "../context/cartContext.jsx";
import { useAuth } from "../context/AuthContext";

import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  // =====================================================
  // JWT AUTHENTICATION
  // =====================================================

  const {
    user,
    loading: authLoading,
  } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SHIPPING ADDRESS
  // =====================================================

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =====================================================
  // LOAD LOCATION FROM LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    const savedLocation =
      JSON.parse(
        localStorage.getItem("userLocation")
      ) || null;

    if (savedLocation) {
      setShippingAddress((prev) => ({
        ...prev,

        city:
          savedLocation.city ||
          savedLocation.county ||
          savedLocation.town ||
          savedLocation.village ||
          "",

        state:
          savedLocation.state || "",
      }));
    }
  }, []);

  // =====================================================
  // OPTIONAL: PREFILL USER INFORMATION
  // =====================================================

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,

        fullName:
          prev.fullName ||
          user.name ||
          "",

        email:
          prev.email ||
          user.email ||
          "",
      }));
    }
  }, [user]);

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const existingScript =
        document.getElementById(
          "razorpay-script"
        );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

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
  // CREATE ORDER IN MONGODB
  // =====================================================

  const createDatabaseOrder = async ({
    paymentMethod,
    razorpayOrderId = null,
    razorpayPaymentId = null,
  }) => {
    try {
      // =================================================
      // CHECK JWT USER
      // =================================================

      if (!user) {
        throw new Error(
          "You must be logged in to place an order."
        );
      }

      // =================================================
      // ORDER DATA
      // =================================================

      const orderData = {
        // -----------------------------------------------
        // PRODUCTS
        // -----------------------------------------------

        products: cartItems.map((item) => ({
          product: item.id,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),

        // -----------------------------------------------
        // CUSTOMER
        // -----------------------------------------------

        customer: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
        },

        // -----------------------------------------------
        // SHIPPING ADDRESS
        // -----------------------------------------------

        shippingAddress: {
          address:
            shippingAddress.address,

          city:
            shippingAddress.city,

          state:
            shippingAddress.state,

          pincode:
            shippingAddress.pincode,
        },

        // -----------------------------------------------
        // PAYMENT
        // -----------------------------------------------

        paymentMethod,

        totalAmount:
          Number(totalPrice),

        status:
          paymentMethod === "COD"
            ? "Pending"
            : "Confirmed",

        // -----------------------------------------------
        // RAZORPAY DETAILS
        // -----------------------------------------------

        razorpayOrderId,
        razorpayPaymentId,
      };

      console.log(
        "ORDER DATA:",
        orderData
      );

      // =================================================
      // SEND ORDER TO BACKEND
      // =================================================
      // JWT is stored in an HttpOnly cookie.
      // credentials: "include" sends that cookie.
      // =================================================

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {
      console.error(
        "Create database order error:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // ONLINE PAYMENT
  // =====================================================

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);

      // -----------------------------------------------
      // LOAD RAZORPAY
      // -----------------------------------------------

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        alert(
          "Razorpay failed to load. Please check your internet connection."
        );

        setLoading(false);
        return;
      }

      // -----------------------------------------------
      // CREATE RAZORPAY ORDER
      // -----------------------------------------------

      const response =
        await axios.post(
          "http://localhost:5000/api/payment/create-order",
          {
            amount: totalPrice,
          },
          {
            withCredentials: true,
          }
        );

      const razorpayOrder =
        response.data.order;

      // -----------------------------------------------
      // RAZORPAY OPTIONS
      // -----------------------------------------------

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        name: "Wearable",

        description:
          "E-commerce Purchase",

        order_id:
          razorpayOrder.id,

        handler:
          async function (
            paymentResponse
          ) {
            try {
              // -------------------------------------
              // VERIFY PAYMENT
              // -------------------------------------

              const verifyResponse =
                await axios.post(
                  "http://localhost:5000/api/payment/verify",
                  {
                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse.razorpay_signature,
                  },
                  {
                    withCredentials: true,
                  }
                );

              // -------------------------------------
              // PAYMENT VERIFICATION FAILED
              // -------------------------------------

              if (
                !verifyResponse.data.success
              ) {
                alert(
                  "Payment verification failed."
                );

                setLoading(false);
                return;
              }

              // -------------------------------------
              // SAVE ORDER IN MONGODB
              // -------------------------------------

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

              // -------------------------------------
              // CLEAR CART
              // -------------------------------------

              clearCart();

              setLoading(false);

              setOrderPlaced(true);

            } catch (error) {
              console.error(
                "Payment verification error:",
                error
              );

              alert(
                error.response?.data?.message ||
                  "Payment was completed but order verification failed. Please contact support."
              );

              setLoading(false);
            }
          },

        // -----------------------------------------------
        // PREFILL RAZORPAY
        // -----------------------------------------------

        prefill: {
          name:
            shippingAddress.fullName,

          email:
            shippingAddress.email,

          contact:
            shippingAddress.phone,
        },

        notes: {
          project:
            "Wearable Ecommerce",
        },

        theme: {
          color: "#2AAE9B",
        },

        modal: {
          ondismiss:
            function () {
              setLoading(false);
            },
        },
      };

      // -----------------------------------------------
      // OPEN RAZORPAY
      // -----------------------------------------------

      const razorpay =
        new window.Razorpay(options);

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
    // =================================================
    // JWT AUTHENTICATION
    // =================================================

    if (!user) {
      alert(
        "Please login before placing an order."
      );

      navigate("/login");

      return;
    }

    // -----------------------------------------------
    // PAYMENT METHOD
    // -----------------------------------------------

    if (!paymentMethod) {
      alert(
        "Please select a payment method"
      );

      return;
    }

    // -----------------------------------------------
    // SHIPPING ADDRESS
    // -----------------------------------------------

    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.phone.trim() ||
      !shippingAddress.email.trim() ||
      !shippingAddress.address.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.state.trim() ||
      !shippingAddress.pincode.trim()
    ) {
      alert(
        "Please complete your shipping address"
      );

      return;
    }

    // -----------------------------------------------
    // PHONE VALIDATION
    // -----------------------------------------------

    if (
      shippingAddress.phone.length !==
        10 ||
      !/^\d+$/.test(
        shippingAddress.phone
      )
    ) {
      alert(
        "Please enter a valid 10-digit phone number"
      );

      return;
    }

    // -----------------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------------

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        shippingAddress.email
      )
    ) {
      alert(
        "Please enter a valid email address"
      );

      return;
    }

    // -----------------------------------------------
    // PINCODE VALIDATION
    // -----------------------------------------------

    if (
      shippingAddress.pincode.length !==
        6 ||
      !/^\d+$/.test(
        shippingAddress.pincode
      )
    ) {
      alert(
        "Please enter a valid 6-digit PIN code"
      );

      return;
    }

    // -----------------------------------------------
    // PAYMENT
    // -----------------------------------------------

    if (paymentMethod === "cod") {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (authLoading) {
    return (
      <div className="checkout-empty">
        <h2>
          Checking login...
        </h2>
      </div>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (
    cartItems.length === 0 &&
    !orderPlaced
  ) {
    return (
      <div className="checkout-empty">

        <h2>
          Your cart is empty
        </h2>

        <button
          onClick={() =>
            navigate("/men")
          }
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
            onClick={() =>
              navigate("/orders")
            }
          >
            View My Orders
          </button>

          <button
            onClick={() =>
              navigate("/")
            }
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

        <h1>
          Checkout
        </h1>

        <div className="checkout-content">

          {/* =========================================
              LEFT SIDE
          ========================================= */}

          <div className="checkout-left">

            {/* =====================================
                ORDER ITEMS
            ===================================== */}

            <div className="checkout-section">

              <h2>
                Your Order
              </h2>

              {cartItems.map(
                (item) => (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                      <p>
                        ₹
                        {(
                          Number(item.price) *
                          Number(
                            item.quantity
                          )
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* =====================================
                SHIPPING ADDRESS
            ===================================== */}

            <div className="checkout-section">

              <h2>
                <MapPin size={20} />
                Shipping Address
              </h2>

              <div className="shipping-form">

                {/* NAME + EMAIL */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={
                        shippingAddress.fullName
                      }
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          fullName:
                            e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={
                        shippingAddress.email
                      }
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          email:
                            e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value={
                        shippingAddress.phone
                      }
                      maxLength={10}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone:
                            e.target.value.replace(
                              /\D/g,
                              ""
                            ),
                        })
                      }
                      placeholder="Enter 10-digit phone number"
                    />

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="form-group">

                  <label>
                    Address
                  </label>

                  <textarea
                    value={
                      shippingAddress.address
                    }
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        address:
                          e.target.value,
                      })
                    }
                    placeholder="House / Flat / Street / Area"
                    rows="3"
                  />

                </div>

                {/* CITY + STATE + PIN */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      City / Area
                    </label>

                    <input
                      type="text"
                      value={
                        shippingAddress.city
                      }
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city:
                            e.target.value,
                        })
                      }
                      placeholder="City / Area"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      State
                    </label>

                    <input
                      type="text"
                      value={
                        shippingAddress.state
                      }
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state:
                            e.target.value,
                        })
                      }
                      placeholder="State"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      PIN Code
                    </label>

                    <input
                      type="text"
                      value={
                        shippingAddress.pincode
                      }
                      maxLength={6}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          pincode:
                            e.target.value.replace(
                              /\D/g,
                              ""
                            ),
                        })
                      }
                      placeholder="6-digit PIN"
                    />

                  </div>

                </div>

              </div>

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
                    setPaymentMethod(
                      "upi"
                    )
                  }
                  disabled={loading}
                >

                  <Smartphone
                    size={25}
                  />

                  <div>

                    <strong>
                      UPI
                    </strong>

                    <p>
                      Google Pay,
                      PhonePe, Paytm
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
                    setPaymentMethod(
                      "card"
                    )
                  }
                  disabled={loading}
                >

                  <CreditCard
                    size={25}
                  />

                  <div>

                    <strong>
                      Credit / Debit Card
                    </strong>

                    <p>
                      Visa, Mastercard,
                      RuPay
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
                    setPaymentMethod(
                      "cod"
                    )
                  }
                  disabled={loading}
                >

                  <Banknote
                    size={25}
                  />

                  <div>

                    <strong>
                      Cash on Delivery
                    </strong>

                    <p>
                      Pay when your
                      order arrives
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

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {Number(
                  totalPrice
                ).toFixed(2)}
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

            <div className="summary-line">
            </div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <span>
                ₹
                {Number(
                  totalPrice
                ).toFixed(2)}
              </span>

            </div>

            <button
              className="place-order-btn"
              onClick={
                handlePlaceOrder
              }
              disabled={loading}
            >

              {loading
                ? "Processing..."
                : paymentMethod ===
                  "cod"
                ? "Place Order"
                : "Pay Now"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}