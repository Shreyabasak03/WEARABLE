import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/Axios"; // or wherever your axios `api` instance is located

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
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const response = await api.get("/orders");
        const data = response.data;

        const ordersData = Array.isArray(data)
          ? data
          : data.orders || [];

        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

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

  if (authLoading) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">
          <Package size={70} />
          <h2>Please Sign In</h2>
          <p>Please sign in to view your orders.</p>
          <Link to="/login" className="shop-now-btn">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">
          <h2>Loading orders...</h2>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-page">
        <div className="empty-orders">
          <Package size={70} />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/men" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <div className="order-history-header">
          <div>
            <h1>Order History</h1>
            <p>View and track your previous orders</p>
          </div>
          <div className="order-count">
            <Package size={20} />
            <span>
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>

        <div className="orders-list">
          {orders.map((order) => {
            const orderId = order._id || order.id;
            const orderDate = order.createdAt || order.date;
            const products = order.products || order.items || [];
            const total = order.totalAmount ?? order.total ?? 0;
            const status = order.status || "Pending";

            return (
              <div className="order-card" key={orderId}>
                <div className="order-card-header">
                  <div>
                    <h3>Order #{orderId}</h3>
                    <p>
                      Placed on{" "}
                      {orderDate
                        ? new Date(orderDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className={`order-status ${status.toLowerCase()}`}>
                    {getStatusIcon(status)}
                    <span>{status}</span>
                  </div>
                </div>

                <div className="order-products">
                  {products.length > 0 ? (
                    products.map((item, index) => {
                      const product =
                        item.product && typeof item.product === "object"
                          ? item.product
                          : item;

                      const productName = product.name || item.name || "Product";
                      const productImage = product.image || item.image || "";
                      const productCategory = product.category || item.category || "";
                      const quantity = item.quantity || 1;
                      const price = item.price ?? product.price ?? 0;

                      return (
                        <div
                          className="order-product"
                          key={item._id || product._id || index}
                        >
                          {productImage && (
                            <img src={productImage} alt={productName} />
                          )}
                          <div className="order-product-info">
                            <h4>{productName}</h4>
                            {productCategory && <p>{productCategory}</p>}
                            <span>Quantity: {quantity}</span>
                          </div>
                          <div className="order-product-price">
                            ${(Number(price) * Number(quantity)).toFixed(2)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-products">
                      No product information available.
                    </p>
                  )}
                </div>

                <div className="order-card-footer">
                  <div>
                    <span>Total Amount</span>
                    <strong>${Number(total).toFixed(2)}</strong>
                  </div>
                  <Link to={`/order/${orderId}`} className="view-order-btn">
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