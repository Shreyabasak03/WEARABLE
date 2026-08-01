import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import { getAllProducts } from "../api/productsApi";
import { useCart } from "../context/cartContext.jsx"; // 1. Import useCart
import "./Men.css";

export default function Men() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // 2. Consume addToCart from central context instead of local useState
  const { addToCart } = useCart();

  const categories = [
    "Women's Tops",
    "Dresses",
    "Kurtis",
    "Sarees",
    "Jeans",
    "T-Shirts",
    "Shirts",
    "Skirts",
    "Shorts",
    "Jumpsuits",
  ];

  return (
    <div className="men">
      {/* HERO */}
      <div className="image-card">
        <div className="image">
          <img
            src="https://images.unsplash.com/photo-1753162659461-38d8ea5b15ab?q=80&w=3131&auto=format&fit=crop"
            alt="Women's fashion"
          />
        </div>

        {/* CATEGORY SLIDER */}
        <div className="category-slider">
          <div className="slide-track">
            {[...categories, ...categories].map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="cards-container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={setSelectedProduct}
          />
        ))}
      </div>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart} // 3. Passes context method to modal
        />
      )}
    </div>
  );
}