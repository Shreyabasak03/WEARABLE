import React from "react";
import "./Dashboard.css";

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


const Dashboard = () => {

  /* =====================================================
     STATISTICS
  ===================================================== */

  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,84,500",
      change: "+12.5%",
      positive: true,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "1,248",
      change: "+8.2%",
      positive: true,
      icon: ShoppingBag,
    },
    {
      title: "Total Products",
      value: "356",
      change: "+4.6%",
      positive: true,
      icon: Package,
    },
    {
      title: "Total Users",
      value: "8,942",
      change: "-2.4%",
      positive: false,
      icon: Users,
    },
  ];


  /* =====================================================
     REVENUE GRAPH DATA
  ===================================================== */

  const revenueData = [
    {
      month: "Feb",
      revenue: 32000,
    },
    {
      month: "Mar",
      revenue: 42000,
    },
    {
      month: "Apr",
      revenue: 36000,
    },
    {
      month: "May",
      revenue: 48000,
    },
    {
      month: "Jun",
      revenue: 44000,
    },
    {
      month: "Jul",
      revenue: 55000,
    },
    {
      month: "Aug",
      revenue: 62500,
    },
  ];


  /* =====================================================
     RECENT ORDERS
  ===================================================== */

  const orders = [
    {
      id: "#ORD-1024",
      customer: "Ananya Sharma",
      product: "Classic Oversized T-Shirt",
      amount: "₹1,598",
      status: "Delivered",
    },
    {
      id: "#ORD-1023",
      customer: "Rahul Das",
      product: "Premium Denim Jacket",
      amount: "₹2,499",
      status: "Processing",
    },
    {
      id: "#ORD-1022",
      customer: "Priya Singh",
      product: "Women's Casual Sneakers",
      amount: "₹1,899",
      status: "Shipped",
    },
    {
      id: "#ORD-1021",
      customer: "Arjun Roy",
      product: "Slim Fit Cargo Pants",
      amount: "₹1,299",
      status: "Delivered",
    },
    {
      id: "#ORD-1020",
      customer: "Sneha Das",
      product: "Minimal Crossbody Bag",
      amount: "₹999",
      status: "Pending",
    },
  ];


  /* =====================================================
     LOW STOCK PRODUCTS
  ===================================================== */

  const lowStockProducts = [
    {
      name: "Classic White T-Shirt",
      category: "Men",
      stock: 4,
    },
    {
      name: "Oversized Hoodie",
      category: "Women",
      stock: 7,
    },
    {
      name: "Leather Crossbody Bag",
      category: "Accessories",
      stock: 3,
    },
    {
      name: "Slim Fit Jeans",
      category: "Men",
      stock: 6,
    },
  ];


  return (
    <div className="dashboard">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Here's what's happening with your store today.
          </p>
        </div>

        <button className="primary-button">
          Download Report
        </button>

      </div>


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="stats-grid">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              className="stat-card"
              key={stat.title}
            >

              <div className="stat-card-top">

                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <button className="stat-more">
                  <MoreHorizontal size={19} />
                </button>

              </div>


              <div className="stat-info">

                <span>
                  {stat.title}
                </span>

                <h2>
                  {stat.value}
                </h2>


                <div
                  className={`stat-change ${
                    stat.positive
                      ? "positive"
                      : "negative"
                  }`}
                >

                  {stat.positive ? (
                    <ArrowUpRight size={15} />
                  ) : (
                    <ArrowDownRight size={15} />
                  )}

                  <span>
                    {stat.change}
                  </span>

                  <small>
                    vs last month
                  </small>

                </div>

              </div>

            </div>
          );

        })}

      </div>


      {/* =================================================
          REVENUE + LOW STOCK
      ================================================= */}

      <div className="dashboard-grid">


        {/* =================================================
            REVENUE
        ================================================= */}

        <div className="dashboard-card revenue-section">

          <div className="section-header">

            <div>

              <h3>
                Revenue Overview
              </h3>

              <p>
                Monthly revenue performance
              </p>

            </div>


            <select className="period-select">

              <option>
                Last 7 months
              </option>

              <option>
                Last 30 days
              </option>

              <option>
                Last 12 months
              </option>

            </select>

          </div>


          {/* Revenue summary */}

          <div className="revenue-summary">

            <h2>
              ₹2,84,500
            </h2>

            <div className="revenue-growth">

              <ArrowUpRight size={16} />

              12.5%

            </div>

          </div>


          {/* REAL GRAPH */}

          <div className="revenue-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={revenueData}

                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#6fd6cb"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="100%"
                      stopColor="#0f4d45"
                      stopOpacity={0}
                    />

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

                  tick={{
                    fill: "var(--text-muted)",
                    fontSize: 11,
                  }}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}

                  tick={{
                    fill: "var(--text-muted)",
                    fontSize: 10,
                  }}

                  tickFormatter={(value) =>
                    `₹${value / 1000}k`
                  }
                />


                <Tooltip
                  contentStyle={{
                    background: "#14201e",
                    border:
                      "1px solid #263d39",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}

                  formatter={(value) => [
                    `₹${value.toLocaleString(
                      "en-IN"
                    )}`,
                    "Revenue",
                  ]}
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

          </div>

        </div>


        {/* =================================================
            LOW STOCK
        ================================================= */}

        <div className="dashboard-card low-stock-section">

          <div className="section-header">

            <div>

              <h3>
                Low Stock
              </h3>

              <p>
                Products that need attention
              </p>

            </div>

            <AlertTriangle
              size={20}
              className="warning-icon"
            />

          </div>


          <div className="stock-list">

            {lowStockProducts.map(
              (product) => (

                <div
                  className="stock-item"
                  key={product.name}
                >

                  <div className="stock-product">

                    <div className="product-placeholder">

                      <Package size={18} />

                    </div>


                    <div>

                      <h4>
                        {product.name}
                      </h4>

                      <span>
                        {product.category}
                      </span>

                    </div>

                  </div>


                  <div className="stock-number">

                    <strong>
                      {product.stock}
                    </strong>

                    <span>
                      left
                    </span>

                  </div>

                </div>

              )
            )}

          </div>


          <button className="view-button">

            View all products

            <ArrowUpRight size={16} />

          </button>

        </div>

      </div>


      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <div className="dashboard-card orders-section">


        <div className="section-header">

          <div>

            <h3>
              Recent Orders
            </h3>

            <p>
              Latest orders from your customers
            </p>

          </div>


          <button className="view-button">

            View all

            <ArrowUpRight size={16} />

          </button>

        </div>


        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Product
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

                <th></th>

              </tr>

            </thead>


            <tbody>

              {orders.map(
                (order) => (

                  <tr key={order.id}>

                    <td className="order-id">
                      {order.id}
                    </td>

                    <td>
                      {order.customer}
                    </td>

                    <td className="order-product">
                      {order.product}
                    </td>

                    <td className="order-amount">
                      {order.amount}
                    </td>

                    <td>

                      <span
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td>

                      <button className="table-more">

                        <MoreHorizontal
                          size={18}
                        />

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default Dashboard;