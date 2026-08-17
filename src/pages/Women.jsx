import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import { getProductsByCategory } from "../api/ProductsApi.js";
import { useCart } from "../context/cartContext";
import "./Men.css";

export default function Women() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // ==========================================
  // CATEGORY SLIDER
  // ==========================================

  const categories = [
    "Women's Shirts",
    "Women's Dresses",
    "Women's Shoes",
    "Women's Watches",
    "Women's Bags",
    "Women's Jewellery",
  ];


  // ==========================================
  // FETCH WOMEN PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const womenProducts =
          await getProductsByCategory("Women");

        setProducts(womenProducts);

      } catch (error) {
        console.error(
          "Failed to fetch women products:",
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
      <div className="women">
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
    <div className="women">

      {/* ======================================
          HERO
      ====================================== */}

      <div className="image-card">

        <div className="image">

          <img
            src="https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dr"
            alt="Women's Fashion"
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

            <h2>
              No Products Found
            </h2>

            <p>
              There are currently no women's
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
        />

      )}

    </div>
  );
}