import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuth } from "@clerk/react";

import "./OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CLERK AUTHENTICATION
  // ==========================================

  const { isSignedIn, getToken } = useAuth();

  // ==========================================
  // LOAD ORDERS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // --------------------------------------
        // USER MUST BE SIGNED IN
        // --------------------------------------

        if (!isSignedIn) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // --------------------------------------
        // GET CLERK TOKEN
        // --------------------------------------

        const token = await getToken();

        if (!token) {
          throw new Error(
            "Authentication token not available"
          );
        }

        console.log("Clerk token received");

        // --------------------------------------
        // SEND TOKEN TO BACKEND
        // --------------------------------------

        const response = await fetch(
          "http://localhost:5001/api/orders",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // --------------------------------------
        // HANDLE ERROR
        // --------------------------------------

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(
            errorData.message ||
              "Failed to fetch orders"
          );
        }

        // --------------------------------------
        // GET DATA
        // --------------------------------------

        const data = await response.json();

        console.log(
          "Orders belonging to current user:",
          data
        );

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

    fetchOrders();

  }, [isSignedIn, getToken]);

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

      default:
        return <Clock size={18} />;
    }
  };

  // ==========================================
  // LOADING
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
  // NOT SIGNED IN
  // ==========================================

  if (!isSignedIn) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">

          <Package size={70} />

          <h2>Please Sign In</h2>

          <p>
            Please sign in to view your orders.
          </p>

          <Link
            to="/"
            className="shop-now-btn"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY ORDERS
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

        {/* HEADER */}

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

        {/* ORDERS */}

        <div className="orders-list">

          {orders.map((order) => {

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
              "Processing";

            return (

              <div
                className="order-card"
                key={orderId}
              >

                {/* ORDER HEADER */}

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

                  <div
                    className={`order-status ${status.toLowerCase()}`}
                  >

                    {getStatusIcon(status)}

                    <span>
                      {status}
                    </span>

                  </div>

                </div>

                {/* PRODUCTS */}

                <div className="order-products">

                  {products.length > 0 ? (

                    products.map(
                      (item, index) => {

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

                        return (

                          <div
                            className="order-product"
                            key={
                              item._id ||
                              product._id ||
                              index
                            }
                          >

                            {productImage && (
                              <img
                                src={productImage}
                                alt={productName}
                              />
                            )}

                            <div className="order-product-info">

                              <h4>
                                {productName}
                              </h4>

                              <p>
                                {productCategory}
                              </p>

                              <span>
                                Quantity:{" "}
                                {quantity}
                              </span>

                            </div>

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
                      No product information available.
                    </p>

                  )}

                </div>

                {/* FOOTER */}

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