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
        setLoading(true);

        // ==========================================
        // USER JWT
        // ==========================================

        const token = localStorage.getItem("userToken");

        console.log("Order ID:", id);
        console.log("User token exists:", !!token);

        // ==========================================
        // API REQUEST
        // ==========================================

        const response = await axios.get(
          `http://localhost:5001/api/orders/${id}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
            withCredentials: true,
          }
        );

        console.log(
          "Order details response:",
          response.data
        );

        // ==========================================
        // HANDLE DIFFERENT RESPONSE FORMATS
        // ==========================================

        const orderData =
          response.data?.order ||
          response.data;

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

  // ==========================================
  // GET LOCATION FROM LOCAL STORAGE
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
      case "canceled":
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
  // ORDER ID
  // ==========================================

  const orderId =
    order._id ||
    order.id ||
    id;

  // ==========================================
  // ORDER STATUS
  // ==========================================

  const orderStatus =
    order.status || "Pending";

  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  const paymentMethod =
    order.paymentMethod ||
    "Not available";

  // ==========================================
  // PAYMENT STATUS
  // ==========================================

  const paymentStatus =
    order.paymentStatus ||
    (
      paymentMethod.toLowerCase() === "cod"
        ? "Pending"
        : "Paid"
    );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="order-details-page">

      <div className="order-details-container">

        {/* ==================================
            BACK BUTTON
        ================================== */}

        <button
          className="back-orders-btn"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft size={17} />

          Back to Orders
        </button>


        {/* ==================================
            HEADER
        ================================== */}

        <div className="order-details-header">

          <div>

            <h1>
              Order Details
            </h1>

            <p>
              Order ID: #{orderId}
            </p>

          </div>


          <div
            className={`order-details-status ${
              orderStatus
                ?.toLowerCase()
                .replace(/\s+/g, "-") ||
              "pending"
            }`}
          >

            {getStatusIcon(orderStatus)}

            <span>
              {orderStatus}
            </span>

          </div>

        </div>


        {/* ==================================
            ORDER DETAILS GRID
        ================================== */}

        <div className="order-details-grid">


          {/* ==================================
              PRODUCTS
          ================================== */}

          <div className="order-details-card">

            <h2>
              <Package size={20} />

              Ordered Products
            </h2>


            <div className="details-products">

              {products.length > 0 ? (

                products.map((item, index) => {

                  // ==================================
                  // PRODUCT OBJECT
                  // ==================================

                  const product =
                    item.product &&
                    typeof item.product === "object"
                      ? item.product
                      : item;


                  // ==================================
                  // PRODUCT NAME
                  // ==================================

                  const productName =
                    product?.name ||
                    item?.name ||
                    "Product";


                  // ==================================
                  // PRODUCT IMAGE
                  // ==================================

                  const productImage =
                    product?.image ||
                    item?.image ||
                    "";


                  // ==================================
                  // PRICE
                  // ==================================

                  const price =
                    item?.price ??
                    product?.price ??
                    0;


                  // ==================================
                  // QUANTITY
                  // ==================================

                  const quantity =
                    item?.quantity ||
                    1;


                  // ==================================
                  // PRODUCT ID
                  // ==================================

                  const productId =
                    item?._id ||
                    product?._id ||
                    index;


                  return (
                    <div
                      className="details-product"
                      key={productId}
                    >

                      {/* IMAGE */}

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


                      {/* INFO */}

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


                      {/* ITEM TOTAL */}

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


          {/* ==================================
              CUSTOMER INFORMATION
          ================================== */}

          <div className="order-details-card">

            <h2>
              Customer Information
            </h2>


            <div className="customer-details">

              {/* NAME */}

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


              {/* EMAIL */}

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {order.customer?.email ||
                    order.shippingAddress?.email ||
                    "Not available"}
                </strong>

              </div>


              {/* PHONE */}

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


          {/* ==================================
              SHIPPING LOCATION
          ================================== */}

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


          {/* ==================================
              PAYMENT INFORMATION
          ================================== */}

          <div className="order-details-card">

            <h2>
              Payment Information
            </h2>


            <div className="payment-details">

              {/* PAYMENT METHOD */}

              <div>

                <span>
                  Payment Method
                </span>

                <strong>
                  {paymentMethod}
                </strong>

              </div>


              {/* PAYMENT STATUS */}

              <div>

                <span>
                  Payment Status
                </span>

                <strong>
                  {paymentStatus}
                </strong>

              </div>


              {/* TOTAL */}

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