import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "./OrderHistory.css";

export default function OrderHistory() {
  // ==========================================
  // JWT AUTHENTICATION
  // ==========================================

  const { user, loading: authLoading } = useAuth();

  // ==========================================
  // STATE
  // ==========================================

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ORDERS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // --------------------------------------
        // USER NOT LOGGED IN
        // --------------------------------------

        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // --------------------------------------
        // FETCH USER ORDERS
        // --------------------------------------
        // JWT is stored in an HttpOnly cookie.
        // Browser sends it automatically.
        // --------------------------------------

        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // --------------------------------------
        // HANDLE BACKEND ERROR
        // --------------------------------------

        if (!response.ok) {
          let errorMessage = "Failed to fetch orders";

          try {
            const errorData = await response.json();

            errorMessage =
              errorData.message || errorMessage;
          } catch (error) {
            // Ignore JSON parsing error
          }

          throw new Error(errorMessage);
        }

        // --------------------------------------
        // GET RESPONSE DATA
        // --------------------------------------

        const data = await response.json();

        console.log(
          "Orders belonging to current user:",
          data
        );

        // --------------------------------------
        // HANDLE RESPONSE FORMAT
        // --------------------------------------

        const ordersData = Array.isArray(data)
          ? data
          : data.orders || [];

        setOrders(ordersData);

      } catch (error) {
        console.error(
          "Error loading orders:",
          error
        );

        setOrders([]);

      } finally {
        setLoading(false);
      }
    };

    // Wait until AuthContext finishes
    // checking the current user.

    if (!authLoading) {
      fetchOrders();
    }

  }, [user, authLoading]);

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={18} />;

      case "shipped":
        return <Truck size={18} />;

      case "cancelled":
        return <XCircle size={18} />;

      case "confirmed":
        return <CheckCircle size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  // ==========================================
  // AUTHENTICATION LOADING
  // ==========================================

  if (authLoading) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">

          <Package size={70} />

          <h2>Please Sign In</h2>

          <p>
            Please sign in to view your orders.
          </p>

          <Link
            to="/login"
            className="shop-now-btn"
          >
            Sign In
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // ORDERS LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">
          <h2>Loading orders...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO ORDERS
  // ==========================================

  if (orders.length === 0) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">

          <Package size={70} />

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/men"
            className="shop-now-btn"
          >
            Start Shopping
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // ORDER HISTORY
  // ==========================================

  return (
    <div className="order-history-page">

      <div className="order-history-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="order-history-header">

          <div>
            <h1>
              Order History
            </h1>

            <p>
              View and track your previous orders
            </p>
          </div>

          <div className="order-count">

            <Package size={20} />

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>

          </div>

        </div>

        {/* ======================================
            ORDERS LIST
        ====================================== */}

        <div className="orders-list">

          {orders.map((order) => {

            // ----------------------------------
            // ORDER INFORMATION
            // ----------------------------------

            const orderId =
              order._id || order.id;

            const orderDate =
              order.createdAt ||
              order.date;

            const products =
              order.products ||
              order.items ||
              [];

            const total =
              order.totalAmount ??
              order.total ??
              0;

            const status =
              order.status ||
              "Pending";

            // ----------------------------------
            // ORDER CARD
            // ----------------------------------

            return (
              <div
                className="order-card"
                key={orderId}
              >

                {/* ==================================
                    ORDER HEADER
                ================================== */}

                <div className="order-card-header">

                  <div>

                    <h3>
                      Order #{orderId}
                    </h3>

                    <p>
                      Placed on{" "}
                      {orderDate
                        ? new Date(
                            orderDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                  {/* ORDER STATUS */}

                  <div
                    className={`order-status ${status.toLowerCase()}`}
                  >

                    {getStatusIcon(status)}

                    <span>
                      {status}
                    </span>

                  </div>

                </div>

                {/* ==================================
                    PRODUCTS
                ================================== */}

                <div className="order-products">

                  {products.length > 0 ? (

                    products.map(
                      (item, index) => {

                        // ------------------------------
                        // PRODUCT DATA
                        // ------------------------------

                        const product =
                          item.product &&
                          typeof item.product ===
                            "object"
                            ? item.product
                            : item;

                        const productName =
                          product.name ||
                          item.name ||
                          "Product";

                        const productImage =
                          product.image ||
                          item.image ||
                          "";

                        const productCategory =
                          product.category ||
                          item.category ||
                          "";

                        const quantity =
                          item.quantity || 1;

                        const price =
                          item.price ??
                          product.price ??
                          0;

                        // ------------------------------
                        // PRODUCT
                        // ------------------------------

                        return (
                          <div
                            className="order-product"
                            key={
                              item._id ||
                              product._id ||
                              index
                            }
                          >

                            {/* PRODUCT IMAGE */}

                            {productImage && (
                              <img
                                src={productImage}
                                alt={productName}
                              />
                            )}

                            {/* PRODUCT INFO */}

                            <div className="order-product-info">

                              <h4>
                                {productName}
                              </h4>

                              {productCategory && (
                                <p>
                                  {productCategory}
                                </p>
                              )}

                              <span>
                                Quantity:{" "}
                                {quantity}
                              </span>

                            </div>

                            {/* PRODUCT PRICE */}

                            <div className="order-product-price">

                              $
                              {(
                                Number(price) *
                                Number(quantity)
                              ).toFixed(2)}

                            </div>

                          </div>
                        );
                      }
                    )

                  ) : (

                    <p className="no-products">
                      No product information
                      available.
                    </p>

                  )}

                </div>

                {/* ==================================
                    ORDER FOOTER
                ================================== */}

                <div className="order-card-footer">

                  <div>

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      $
                      {Number(total).toFixed(2)}
                    </strong>

                  </div>

                  <Link
                    to={`/order/${orderId}`}
                    className="view-order-btn"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}