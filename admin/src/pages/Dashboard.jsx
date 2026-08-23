import React, { useEffect, useState } from "react";
import adminApi from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [ordersResponse, productsResponse, usersResponse] = await Promise.all([
        adminApi.get("/orders"),
        adminApi.get("/products"),
        adminApi.get("/users"),
      ]);

      setOrders(ordersResponse.data || []);
      setProducts(
        productsResponse.data.products ||
          productsResponse.data ||
          []
      );
      setTotalUsers(usersResponse.data.totalCount || 0);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.totalAmount || 0), 0);

  const totalOrders = orders.length;

  const lowStockProducts = products
    .filter((product) => Number(product.stock || 0) <= 10)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 5);

  const revenueMap = {};
  orders
    .filter((order) => order.status !== "Cancelled")
    .forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleDateString("en-IN", { month: "short" });
      revenueMap[month] = (revenueMap[month] || 0) + Number(order.totalAmount || 0);
    });

  const revenueData = Object.keys(revenueMap).map((month) => ({
    month,
    revenue: revenueMap[month],
  }));

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Loading store data...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "Live",
      positive: true,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString("en-IN"),
      change: "Live",
      positive: true,
      icon: ShoppingBag,
    },
    {
      title: "Total Products",
      value: products.length.toLocaleString("en-IN"),
      change: "Live",
      positive: true,
      icon: Package,
    },
    {
      title: "Total Users",
      value: totalUsers.toLocaleString("en-IN"),
      change: "Live",
      positive: true,
      icon: Users,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your store today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={21} />
                </div>
              </div>
              <div className="stat-info">
                <span>{stat.title}</span>
                <h2>{stat.value}</h2>
                <div
                  className={`stat-change ${
                    stat.positive ? "positive" : "negative"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight size={15} />
                  ) : (
                    <ArrowDownRight size={15} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card revenue-section">
          <div className="section-header">
            <div>
              <h3>Revenue Overview</h3>
              <p>Revenue from customer orders</p>
            </div>
          </div>

          <div className="revenue-summary">
            <h2>{formatCurrency(totalRevenue)}</h2>
            <div className="revenue-growth">
              <ArrowUpRight size={16} />
              Live
            </div>
          </div>

          <div className="revenue-chart">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6fd6cb" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0f4d45" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#14201e",
                      border: "1px solid #263d39",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6fd6cb"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    activeDot={{
                      r: 5,
                      fill: "#6fd6cb",
                      stroke: "#0f4d45",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                No revenue data available yet.
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card low-stock-section">
          <div className="section-header">
            <div>
              <h3>Low Stock</h3>
              <p>Products that need attention</p>
            </div>
            <AlertTriangle size={20} className="warning-icon" />
          </div>

          <div className="stock-list">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div className="stock-item" key={product._id}>
                  <div className="stock-product">
                    <div className="product-placeholder">
                      <Package size={18} />
                    </div>
                    <div>
                      <h4>{product.name}</h4>
                      <span>{product.category}</span>
                    </div>
                  </div>
                  <div className="stock-number">
                    <strong>{product.stock}</strong>
                    <span>left</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-stock-warning">
                All products have sufficient stock.
              </p>
            )}
          </div>

          <button
            type="button"
            className="view-button"
            onClick={() => {
              navigate("/admin/products");
            }}
          >
            View all Products
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <div className="dashboard-card orders-section">
        <div className="section-header">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest orders from your customers</p>
          </div>
          <button
            type="button"
            className="view-button"
            onClick={() => {
              navigate("/admin/orders");
            }}
          >
            View all
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">#{order._id.slice(-6)}</td>
                    <td>{order.customer?.name || "Unknown"}</td>
                    <td className="order-product">
                      {order.products?.map((item, index) => (
                        <div key={index}>
                          {item.name} {" × "} {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="order-amount">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td>
                      <span
                        className={`status ${order.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="table-more">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;