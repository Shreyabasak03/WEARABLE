import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api"; // adjust path to your axios instance

import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
} from "lucide-react";

import "./OrderDetails.css";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        const orderData = response.data?.order || response.data;
        setOrder(orderData);
      } catch (error) {
        console.error(
          "ERROR FETCHING ORDER:",
          error.response?.data || error.message
        );
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [id]);

  const savedLocation = (() => {
    try {
      return JSON.parse(localStorage.getItem("userLocation")) || null;
    } catch (error) {
      console.error("Error reading saved location:", error);
      return null;
    }
  })();

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={18} />;
      case "shipped":
        return <Truck size={18} />;
      case "cancelled":
      case "canceled":
        return <XCircle size={18} />;
      case "confirmed":
        return <Package size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-loading">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-not-found">
          <Package size={60} />
          <h2>Order Not Found</h2>
          <p>We couldn't find this order.</p>
          <button onClick={() => navigate("/orders")}>Back to Orders</button>
        </div>
      </div>
    );
  }

  const products = order.products || order.items || [];
  const total = order.totalAmount ?? order.total ?? 0;
  const shippingAddress = order.shippingAddress || null;
  const locationName =
    savedLocation?.county ||
    savedLocation?.city ||
    savedLocation?.town ||
    savedLocation?.village ||
    "";
  const locationState = savedLocation?.state || "";
  const orderId = order._id || order.id || id;
  const orderStatus = order.status || "Pending";
  const paymentMethod = order.paymentMethod || "Not available";
  const paymentStatus =
    order.paymentStatus ||
    (paymentMethod.toLowerCase() === "cod" ? "Pending" : "Paid");

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <button
          className="back-orders-btn"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>

        <div className="order-details-header">
          <div>
            <h1>Order Details</h1>
            <p>Order ID: #{orderId}</p>
          </div>
          <div
            className={`order-details-status ${
              orderStatus?.toLowerCase().replace(/\s+/g, "-") || "pending"
            }`}
          >
            {getStatusIcon(orderStatus)}
            <span>{orderStatus}</span>
          </div>
        </div>

        <div className="order-details-grid">
          <div className="order-details-card">
            <h2>
              <Package size={20} />
              Ordered Products
            </h2>

            <div className="details-products">
              {products.length > 0 ? (
                products.map((item, index) => {
                  const product =
                    item.product && typeof item.product === "object"
                      ? item.product
                      : item;

                  const productName = product?.name || item?.name || "Product";
                  const productImage = product?.image || item?.image || "";
                  const price = item?.price ?? product?.price ?? 0;
                  const quantity = item?.quantity || 1;
                  const productId = item?._id || product?._id || index;

                  return (
                    <div className="details-product" key={productId}>
                      {productImage ? (
                        <img src={productImage} alt={productName} />
                      ) : (
                        <div className="product-image-placeholder">
                          <Package size={30} />
                        </div>
                      )}

                      <div className="details-product-info">
                        <h3>{productName}</h3>
                        <p>Quantity: {quantity}</p>
                        <span>₹{Number(price).toLocaleString("en-IN")}</span>
                      </div>

                      <strong>
                        ₹{(Number(price) * Number(quantity)).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  );
                })
              ) : (
                <p>No product information available.</p>
              )}
            </div>
          </div>

          <div className="order-details-card">
            <h2>Customer Information</h2>
            <div className="customer-details">
              <div>
                <span>Name</span>
                <strong>
                  {order.customer?.name ||
                    order.shippingAddress?.fullName ||
                    "Not available"}
                </strong>
              </div>
              <div>
                <span>Email</span>
                <strong>
                  {order.customer?.email ||
                    order.shippingAddress?.email ||
                    "Not available"}
                </strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>
                  {order.customer?.phone ||
                    order.shippingAddress?.phone ||
                    "Not available"}
                </strong>
              </div>
            </div>
          </div>

          <div className="order-details-card">
            <h2>
              <MapPin size={20} />
              Shipping Address
            </h2>
            <div className="shipping-details">
              {shippingAddress ? (
                <>
                  {shippingAddress.fullName && (
                    <p><strong>{shippingAddress.fullName}</strong></p>
                  )}
                  {shippingAddress.address && <p>{shippingAddress.address}</p>}
                  {(shippingAddress.city || shippingAddress.state) && (
                    <p>
                      {shippingAddress.city}
                      {shippingAddress.city && shippingAddress.state ? ", " : ""}
                      {shippingAddress.state}
                    </p>
                  )}
                  {shippingAddress.pincode && (
                    <p>PIN: {shippingAddress.pincode}</p>
                  )}
                  {shippingAddress.phone && (
                    <p className="shipping-phone">
                      <Phone size={15} />
                      {shippingAddress.phone}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {locationName ? (
                    <>
                      <div className="current-location-display">
                        <MapPin size={20} />
                        <div>
                          <strong>{locationName}</strong>
                          {locationState && <span>{locationState}</span>}
                        </div>
                      </div>
                      <p className="location-note">
                        This is the location selected from your current location.
                      </p>
                    </>
                  ) : (
                    <p>Shipping location not available.</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="order-details-card">
            <h2>Payment Information</h2>
            <div className="payment-details">
              <div>
                <span>Payment Method</span>
                <strong>{paymentMethod}</strong>
              </div>
              <div>
                <span>Payment Status</span>
                <strong>{paymentStatus}</strong>
              </div>
              <div>
                <span>Total Amount</span>
                <strong className="details-total">
                  ₹{Number(total).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}