import React, { useEffect, useState } from "react";
import adminApi from "../api/axios";

import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import "./Orders.css";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await adminApi.get("/orders/admin");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await adminApi.put(`/orders/${orderId}`, {
        status: newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? response.data.order : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name?.toLowerCase() || "";
    const productNames =
      order.products?.map((item) => item.name).join(" ").toLowerCase() || "";
    const orderId = order._id?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    const matchesSearch =
      orderId.includes(searchText) ||
      customerName.includes(searchText) ||
      productNames.includes(searchText);

    const matchesStatus =
      statusFilter === "All Status" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={14} />;
      case "Shipped":
        return <Truck size={14} />;
      case "Confirmed":
        return <Package size={14} />;
      case "Pending":
        return <Clock size={14} />;
      case "Cancelled":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const confirmedOrders = orders.filter((order) => order.status === "Confirmed").length;
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>Loading customer orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders.</p>
        </div>
      </div>

      <div className="order-stats">
        <div className="order-stat-card">
          <div className="order-stat-icon all">
            <Package size={19} />
          </div>
          <div>
            <span>Total Orders</span>
            <h3>{totalOrders}</h3>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon pending">
            <Clock size={19} />
          </div>
          <div>
            <span>Pending</span>
            <h3>{pendingOrders}</h3>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon processing">
            <Package size={19} />
          </div>
          <div>
            <span>Confirmed</span>
            <h3>{confirmedOrders}</h3>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon delivered">
            <CheckCircle size={19} />
          </div>
          <div>
            <span>Delivered</span>
            <h3>{deliveredOrders}</h3>
          </div>
        </div>
      </div>

      <div className="orders-card">
        <div className="orders-toolbar">
          <div className="order-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="order-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-management-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className="order-number">
                      #{order._id.slice(-6)}
                    </span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {order.customer?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{order.customer?.name}</h4>
                        <span>{order.customer?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="order-product-name">
                      {order.products?.map((item, index) => (
                        <div key={index}>
                          {item.name} {" × "} {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong className="order-total">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </td>
                  <td>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
                    <div className="order-status-wrapper">
                      {getStatusIcon(order.status)}
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`order-status-select ${order.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="order-actions">
                      <button
                        type="button"
                        title="View order"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-orders">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="orders-footer">
          <span>
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
          <div className="orders-pagination">
            <button disabled>Previous</button>
            <button className="active-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <div>
                <h2>Order Details</h2>
                <span>#{selectedOrder._id.slice(-6)}</span>
              </div>
              <button
                type="button"
                className="order-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="order-modal-section">
              <h3>Customer Information</h3>
              <div className="order-detail-grid">
                <div>
                  <span>Name</span>
                  <strong>{selectedOrder.customer?.name}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedOrder.customer?.email}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{selectedOrder.customer?.phone}</strong>
                </div>
              </div>
            </div>

            <div className="order-modal-section">
              <h3>Products</h3>
              <div className="order-products-list">
                {selectedOrder.products?.map((item, index) => (
                  <div className="order-product-row" key={index}>
                    <div className="order-product-details">
                      {item.image && (
                        <img src={item.image} alt={item.name} />
                      )}
                      <div>
                        <strong>{item.name}</strong>
                        <span>Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    <strong>
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-modal-section">
              <h3>Shipping Address</h3>
              <p className="shipping-address">
                {selectedOrder.shippingAddress?.address}
                <br />
                {selectedOrder.shippingAddress?.city},{" "}
                {selectedOrder.shippingAddress?.state}
                <br />
                PIN: {selectedOrder.shippingAddress?.pincode}
              </p>
            </div>

            <div className="order-modal-bottom">
              <div>
                <span>Payment</span>
                <strong>{selectedOrder.paymentMethod}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{selectedOrder.status}</strong>
              </div>
              <div>
                <span>Total Amount</span>
                <strong className="modal-total">
                  ₹
                  {Number(selectedOrder.totalAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>

            <div className="order-modal-date">
              Order placed on{" "}
              {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;