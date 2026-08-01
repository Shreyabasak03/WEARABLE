import React from "react";
import { Heart } from "lucide-react";
import "./ProductCard.css";

export default function ProductCard({
  product,
  onViewDetails,
}) {
  return (
    <div className="product-card">

      <div className="product-img-box">

        <img
          src={product.thumbnail}
          alt={product.title}
        />

        <button className="heart-btn">
          <Heart size={20} />
        </button>

      </div>

      <div className="product-card-body">

        <div className="product-name">

          <h3>{product.title}</h3>

          <span>
            ${Number(product.price).toFixed(2)}
          </span>

        </div>

        <p className="product-brand">
          {product.brand}
        </p>

        <button
          className="details-btn"
          onClick={() => onViewDetails(product)}
        >
          View More Details
        </button>

      </div>

    </div>
  );
}