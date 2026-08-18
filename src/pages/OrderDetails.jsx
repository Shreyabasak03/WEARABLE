import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

import axios from "axios";

import "./OrderDetails.css";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET PARTICULAR ORDER
  // ==========================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/orders/${id}`
        );

        console.log("Order details:", response.data);

        setOrder(response.data);
      } catch (error) {
        console.error(
          "Error fetching order:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ==========================================
  // GET LOCATION FROM NAVBAR / LOCAL STORAGE
  // ==========================================

  const savedLocation = (() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("userLocation")
        ) || null
      );
    } catch (error) {
      console.error(
        "Error reading saved location:",
        error
      );

      return null;
    }
  })();

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
        return <Package size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="order-details-page">

        <div className="order-details-loading">
          Loading order...
        </div>

      </div>
    );
  }

  // ==========================================
  // ORDER NOT FOUND
  // ==========================================

  if (!order) {
    return (
      <div className="order-details-page">

        <div className="order-not-found">

          <Package size={60} />

          <h2>
            Order Not Found
          </h2>

          <p>
            We couldn't find this order.
          </p>

          <button
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  const products =
    order.products ||
    order.items ||
    [];

  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    order.totalAmount ??
    order.total ??
    0;

  // ==========================================
  // SHIPPING ADDRESS
  // ==========================================

  const shippingAddress =
    order.shippingAddress || null;

  // ==========================================
  // FALLBACK LOCATION
  // ==========================================

  const locationName =
    savedLocation?.county ||
    savedLocation?.city ||
    savedLocation?.town ||
    savedLocation?.village ||
    "";

  const locationState =
    savedLocation?.state ||
    "";

  // ==========================================
  // ORDER DETAILS
  // ==========================================

  return (
    <div className="order-details-page">

      <div className="order-details-container">

        {/* ================================== */}
        {/* BACK BUTTON */}
        {/* ================================== */}

        <button
          className="back-orders-btn"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>


        {/* ================================== */}
        {/* HEADER */}
        {/* ================================== */}

        <div className="order-details-header">

          <div>

            <h1>
              Order Details
            </h1>

            <p>
              Order ID: #
              {order._id || order.id}
            </p>

          </div>


          <div
            className={`order-details-status ${
              order.status
                ?.toLowerCase()
                .replace(" ", "-") || "pending"
            }`}
          >

            {getStatusIcon(order.status)}

            <span>
              {order.status || "Pending"}
            </span>

          </div>

        </div>


        {/* ================================== */}
        {/* ORDER DETAILS GRID */}
        {/* ================================== */}

        <div className="order-details-grid">


          {/* ================================== */}
          {/* PRODUCTS */}
          {/* ================================== */}

          <div className="order-details-card">

            <h2>
              <Package size={20} />
              Ordered Products
            </h2>


            <div className="details-products">

              {products.length > 0 ? (

                products.map((item, index) => {

                  /*
                    Your backend may return:

                    item.product = {
                      name,
                      image,
                      price
                    }

                    OR directly:

                    item.name
                    item.image
                    item.price
                  */

                  const product =
                    item.product &&
                    typeof item.product === "object"
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


                  const price =
                    item.price ??
                    product.price ??
                    0;


                  const quantity =
                    item.quantity ||
                    1;


                  return (

                    <div
                      className="details-product"
                      key={
                        item._id ||
                        product._id ||
                        index
                      }
                    >

                      {productImage ? (

                        <img
                          src={productImage}
                          alt={productName}
                        />

                      ) : (

                        <div className="product-image-placeholder">
                          <Package size={30} />
                        </div>

                      )}


                      <div className="details-product-info">

                        <h3>
                          {productName}
                        </h3>

                        <p>
                          Quantity: {quantity}
                        </p>

                        <span>
                          ₹
                          {Number(
                            price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>


                      <strong>

                        ₹
                        {(
                          Number(price) *
                          Number(quantity)
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </strong>

                    </div>

                  );

                })

              ) : (

                <p>
                  No product information available.
                </p>

              )}

            </div>

          </div>


          {/* ================================== */}
          {/* CUSTOMER INFORMATION */}
          {/* ================================== */}

          <div className="order-details-card">

            <h2>
              Customer Information
            </h2>


            <div className="customer-details">

              <div>

                <span>
                  Name
                </span>

                <strong>
                  {order.customer?.name ||
                    order.shippingAddress?.fullName ||
                    "Not available"}
                </strong>

              </div>


              <div>

                <span>
                  Email
                </span>

                <strong>
                  {order.customer?.email ||
                    "Not available"}
                </strong>

              </div>


              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {order.customer?.phone ||
                    order.shippingAddress?.phone ||
                    "Not available"}
                </strong>

              </div>

            </div>

          </div>


          {/* ================================== */}
          {/* SHIPPING LOCATION */}
          {/* ================================== */}

          <div className="order-details-card">

            <h2>

              <MapPin size={20} />

              Shipping Address

            </h2>


            <div className="shipping-details">

              {shippingAddress ? (

                <>

                  {/* FULL NAME */}

                  {shippingAddress.fullName && (
                    <p>
                      <strong>
                        {shippingAddress.fullName}
                      </strong>
                    </p>
                  )}


                  {/* EXACT ADDRESS */}

                  {shippingAddress.address && (
                    <p>
                      {shippingAddress.address}
                    </p>
                  )}


                  {/* CITY + STATE */}

                  {(shippingAddress.city ||
                    shippingAddress.state) && (

                    <p>

                      {shippingAddress.city}

                      {shippingAddress.city &&
                        shippingAddress.state
                        ? ", "
                        : ""}

                      {shippingAddress.state}

                    </p>

                  )}


                  {/* PIN */}

                  {shippingAddress.pincode && (
                    <p>
                      PIN:{" "}
                      {shippingAddress.pincode}
                    </p>
                  )}


                  {/* PHONE */}

                  {shippingAddress.phone && (

                    <p className="shipping-phone">

                      <Phone size={15} />

                      {shippingAddress.phone}

                    </p>

                  )}

                </>

              ) : (

                /* ==================================
                   FALLBACK TO NAVBAR LOCATION
                ================================== */

                <>

                  {locationName ? (

                    <>

                      <div className="current-location-display">

                        <MapPin size={20} />

                        <div>

                          <strong>
                            {locationName}
                          </strong>

                          {locationState && (
                            <span>
                              {locationState}
                            </span>
                          )}

                        </div>

                      </div>


                      <p className="location-note">

                        This is the location selected
                        from your current location.

                      </p>

                    </>

                  ) : (

                    <p>
                      Shipping location not available.
                    </p>

                  )}

                </>

              )}

            </div>

          </div>


          {/* ================================== */}
          {/* PAYMENT INFORMATION */}
          {/* ================================== */}

          <div className="order-details-card">

            <h2>
              Payment Information
            </h2>


            <div className="payment-details">

              <div>

                <span>
                  Payment Method
                </span>

                <strong>
                  {order.paymentMethod ||
                    "Not available"}
                </strong>

              </div>


              <div>

                <span>
                  Payment Status
                </span>

                <strong>
                  {order.paymentStatus ||
                    (
                      order.paymentMethod ===
                      "cod"
                        ? "Pending"
                        : "Paid"
                    )}
                </strong>

              </div>


              <div>

                <span>
                  Total Amount
                </span>

                <strong className="details-total">

                  ₹
                  {Number(
                    total
                  ).toLocaleString(
                    "en-IN"
                  )}

                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}