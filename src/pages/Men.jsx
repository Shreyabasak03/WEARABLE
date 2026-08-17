import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import { getProductsByCategory } from "../api/ProductsApi.js";
import { useCart } from "../context/cartContext";
import "./Men.css";

export default function Men() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // ==========================================
  // CATEGORY SLIDER
  // ==========================================

  const categories = [
    "Men's Shirts",
    "Men's Shoes",
    "Men's Watches",
  ];

  // ==========================================
  // FETCH MEN PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const menProducts =
          await getProductsByCategory("Men");

        setProducts(menProducts);
      } catch (error) {
        console.error(
          "Failed to fetch men products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="men">
        <div className="products-loading">
          <h2>Loading Products...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="men">

      {/* ======================================
          HERO
      ====================================== */}

      <div className="image-card">

        <div className="image">
          <img
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600&auto=format&fit=crop"
            alt="Men's Fashion"
          />
        </div>


        {/* ====================================
            CATEGORY SLIDER
        ==================================== */}

        <div className="category-slider">

          <div className="slide-track">

            {[...categories, ...categories].map(
              (item, index) => (
                <span key={index}>
                  {item}
                </span>
              )
            )}

          </div>

        </div>

      </div>


      {/* ======================================
          PRODUCTS
      ====================================== */}

      <div className="cards-container">

        {products.length > 0 ? (

          products.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
              onViewDetails={setSelectedProduct}
            />

          ))

        ) : (

          <div className="no-products">

            <h2>No Products Found</h2>

            <p>
              There are currently no men's
              products available.
            </p>

          </div>

        )}

      </div>


      {/* ======================================
          PRODUCT DETAILS
      ====================================== */}

      {selectedProduct && (

        <ProductDetails
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
          onAddToCart={addToCart}
        />

      )}

    </div>
  );
}