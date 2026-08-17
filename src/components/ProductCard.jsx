import React from "react";
import { Heart } from "lucide-react";
import "./ProductCard.css";

export default function ProductCard({
  product,
  onViewDetails,
}) {
  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}

      <div className="product-img-box">

        <img
          src={product.image}
          alt={product.name}
        />

        <button
          className="heart-btn"
          type="button"
        >
          <Heart size={20} />
        </button>

      </div>


      {/* PRODUCT INFORMATION */}

      <div className="product-card-body">

        <div className="product-name">

          <h3>
            {product.name}
          </h3>

          <span>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

        </div>


        {/* BRAND */}

        {product.brand && (
          <p className="product-brand">
            {product.brand}
          </p>
        )}


        {/* DETAILS BUTTON */}

        <button
          className="details-btn"
          onClick={() =>
            onViewDetails(product)
          }
        >
          View More Details
        </button>

      </div>

    </div>
  );
}