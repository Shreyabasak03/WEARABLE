import React, { useState } from "react";
import {
  Search,
  Eye,
  MoreHorizontal,
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


  const orders = [
    {
      id: "#ORD-1024",
      customer: "Ananya Sharma",
      email: "ananya@gmail.com",
      product: "Classic Oversized T-Shirt",
      amount: 1598,
      date: "Aug 15, 2026",
      status: "Delivered",
    },
    {
      id: "#ORD-1023",
      customer: "Rahul Das",
      email: "rahul@gmail.com",
      product: "Premium Denim Jacket",
      amount: 2499,
      date: "Aug 14, 2026",
      status: "Processing",
    },
    {
      id: "#ORD-1022",
      customer: "Priya Singh",
      email: "priya@gmail.com",
      product: "Women's Casual Sneakers",
      amount: 1899,
      date: "Aug 14, 2026",
      status: "Shipped",
    },
    {
      id: "#ORD-1021",
      customer: "Arjun Roy",
      email: "arjun@gmail.com",
      product: "Slim Fit Cargo Pants",
      amount: 1299,
      date: "Aug 13, 2026",
      status: "Delivered",
    },
    {
      id: "#ORD-1020",
      customer: "Sneha Das",
      email: "sneha@gmail.com",
      product: "Minimal Crossbody Bag",
      amount: 999,
      date: "Aug 13, 2026",
      status: "Pending",
    },
    {
      id: "#ORD-1019",
      customer: "Riya Sen",
      email: "riya@gmail.com",
      product: "Oversized Hoodie",
      amount: 1599,
      date: "Aug 12, 2026",
      status: "Cancelled",
    },
    {
      id: "#ORD-1018",
      customer: "Amit Roy",
      email: "amit@gmail.com",
      product: "Classic White Shirt",
      amount: 1199,
      date: "Aug 12, 2026",
      status: "Shipped",
    },
  ];


  /* =====================================================
     FILTER ORDERS
  ===================================================== */

  const filteredOrders = orders.filter((order) => {

    const matchesSearch =
      order.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      order.customer
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      order.product
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesStatus =
      statusFilter === "All Status" ||
      order.status === statusFilter;


    return matchesSearch && matchesStatus;

  });


  /* =====================================================
     STATUS ICON
  ===================================================== */

  const getStatusIcon = (status) => {

    switch (status) {

      case "Delivered":
        return <CheckCircle size={14} />;

      case "Shipped":
        return <Truck size={14} />;

      case "Processing":
        return <Package size={14} />;

      case "Pending":
        return <Clock size={14} />;

      case "Cancelled":
        return <XCircle size={14} />;

      default:
        return null;
    }
  };


  return (

    <div className="orders-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="orders-header">

        <div>

          <h1>
            Orders
          </h1>

          <p>
            Manage and track customer orders.
          </p>

        </div>

      </div>


      {/* =================================================
          ORDER STATISTICS
      ================================================= */}

      <div className="order-stats">


        <div className="order-stat-card">

          <div className="order-stat-icon all">
            <Package size={19} />
          </div>

          <div>

            <span>
              Total Orders
            </span>

            <h3>
              1,248
            </h3>

          </div>

        </div>


        <div className="order-stat-card">

          <div className="order-stat-icon pending">
            <Clock size={19} />
          </div>

          <div>

            <span>
              Pending
            </span>

            <h3>
              24
            </h3>

          </div>

        </div>


        <div className="order-stat-card">

          <div className="order-stat-icon processing">
            <Package size={19} />
          </div>

          <div>

            <span>
              Processing
            </span>

            <h3>
              38
            </h3>

          </div>

        </div>


        <div className="order-stat-card">

          <div className="order-stat-icon delivered">
            <CheckCircle size={19} />
          </div>

          <div>

            <span>
              Delivered
            </span>

            <h3>
              1,132
            </h3>

          </div>

        </div>


      </div>


      {/* =================================================
          ORDERS CARD
      ================================================= */}

      <div className="orders-card">


        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="orders-toolbar">


          <div className="order-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search orders, customers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            className="order-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option>
              All Status
            </option>

            <option>
              Pending
            </option>

            <option>
              Processing
            </option>

            <option>
              Shipped
            </option>

            <option>
              Delivered
            </option>

            <option>
              Cancelled
            </option>

          </select>


        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="orders-table-wrapper">

          <table className="orders-management-table">

            <thead>

              <tr>

                <th>
                  Order
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
                  Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredOrders.map((order) => (

                <tr key={order.id}>


                  {/* Order */}

                  <td>

                    <span className="order-number">
                      {order.id}
                    </span>

                  </td>


                  {/* Customer */}

                  <td>

                    <div className="customer-info">

                      <div className="customer-avatar">
                        {order.customer
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <h4>
                          {order.customer}
                        </h4>

                        <span>
                          {order.email}
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* Product */}

                  <td>

                    <span className="order-product-name">
                      {order.product}
                    </span>

                  </td>


                  {/* Amount */}

                  <td>

                    <strong className="order-total">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </strong>

                  </td>


                  {/* Date */}

                  <td>

                    <span className="order-date">
                      {order.date}
                    </span>

                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={`order-status ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >

                      {getStatusIcon(order.status)}

                      {order.status}

                    </span>

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="order-actions">

                      <button
                        title="View order"
                      >

                        <Eye size={16} />

                      </button>


                      <button
                        title="More"
                      >

                        <MoreHorizontal
                          size={17}
                        />

                      </button>

                    </div>

                  </td>


                </tr>

              ))}


              {filteredOrders.length === 0 && (

                <tr>

                  <td
                    colSpan="7"
                    className="no-orders"
                  >

                    No orders found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="orders-footer">

          <span>

            Showing {filteredOrders.length} of{" "}
            {orders.length} orders

          </span>


          <div className="orders-pagination">

            <button disabled>
              Previous
            </button>

            <button className="active-page">
              1
            </button>

            <button>
              2
            </button>

            <button>
              3
            </button>

            <button>
              Next
            </button>

          </div>

        </div>


      </div>

    </div>
  );
};


export default Orders;