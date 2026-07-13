import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      {/* Product Image */}
      <div className="product-image">
        <img src={product.image} alt={product.title} />

        <button className="wishlist-btn">
          <Heart size={20} />
        </button>
      </div>

      {/* Product Details */}
      <div className="product-content">
        <p className="category">{product.category}</p>

        <h3 className="title">
          {product.title.length > 45
            ? product.title.substring(0, 45) + "..."
            : product.title}
        </h3>

        <div className="rating">
          ⭐ {product.rating.rate}
          <span> ({product.rating.count} Reviews)</span>
        </div>

        <div className="price">
          <h2>${product.price}</h2>
        </div>

        <div className="buttons">
          <Link to={`/product/${product.id}`}>
            <button className="details-btn">
              View Details
            </button>
          </Link>

          <button
            className="cart-btn"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}