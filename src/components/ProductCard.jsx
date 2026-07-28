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
          src={product.image}
          alt={product.name}
        />

        <button className="heart-btn">
          <Heart size={20} />
        </button>

      </div>

      <div className="product-card-body">

        <div className="product-name">
          <h3>{product.name}</h3>

          <span>
            ${product.price}
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