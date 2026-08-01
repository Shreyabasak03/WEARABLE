import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

import "./OrderHistory.css";

export default function OrderHistory() {

  const [orders, setOrders] = useState([]);

  // --------------------------------
  // LOAD ORDERS
  // --------------------------------

  useEffect(() => {

    const savedOrders =
      localStorage.getItem("orders");

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error(
          "Error loading orders:",
          error
        );

        setOrders([]);
      }
    }

  }, []);


  // --------------------------------
  // ORDER STATUS ICON
  // --------------------------------

  const getStatusIcon = (status) => {

    switch (status) {

      case "Delivered":
        return <CheckCircle size={18} />;

      case "Shipped":
        return <Truck size={18} />;

      case "Cancelled":
        return <XCircle size={18} />;

      default:
        return <Clock size={18} />;

    }
  };


  // --------------------------------
  // EMPTY ORDERS
  // --------------------------------

  if (orders.length === 0) {

    return (
      <div className="order-history-page">

        <div className="empty-orders">

          <Package size={70} />

          <h2>
            No Orders Yet
          </h2>

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


  return (

    <div className="order-history-page">

      <div className="order-history-container">


        {/* -------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------- */}

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


        {/* -------------------------------- */}
        {/* ORDERS */}
        {/* -------------------------------- */}

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >


              {/* -------------------------------- */}
              {/* ORDER HEADER */}
              {/* -------------------------------- */}

              <div className="order-card-header">

                <div>

                  <h3>
                    Order #{order.id}
                  </h3>

                  <p>
                    Placed on{" "}
                    {order.date}
                  </p>

                </div>


                <div
                  className={`order-status ${order.status?.toLowerCase()}`}
                >

                  {getStatusIcon(
                    order.status
                  )}

                  <span>
                    {order.status ||
                      "Processing"}
                  </span>

                </div>

              </div>


              {/* -------------------------------- */}
              {/* ORDER PRODUCTS */}
              {/* -------------------------------- */}

              <div className="order-products">

                {order.items?.map((item) => (

                  <div
                    className="order-product"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />


                    <div className="order-product-info">

                      <h4>
                        {item.name}
                      </h4>

                      <p>
                        {item.category}
                      </p>

                      <span>
                        Quantity:{" "}
                        {item.quantity}
                      </span>

                    </div>


                    <div className="order-product-price">

                      $
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toFixed(2)}

                    </div>

                  </div>

                ))}

              </div>


              {/* -------------------------------- */}
              {/* ORDER FOOTER */}
              {/* -------------------------------- */}

              <div className="order-card-footer">

                <div>

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    $
                    {Number(
                      order.total
                    ).toFixed(2)}
                  </strong>

                </div>


                <Link
                  to={`/order/${order.id}`}
                  className="view-order-btn"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}