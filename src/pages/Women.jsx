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

  const categories = [
    "women's Shirts",
    "women's Dresses",
    "women's Shoes",
    "women's Watches",
    "women's Bags",
    "women's Jewellery",
  ];

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const [
        tops,
        dresses,
        shoes,
        watches,
        bags,
        jewellery,
      ] = await Promise.all([
        getProductsByCategory("tops"),
        getProductsByCategory("womens-dresses"),
        getProductsByCategory("womens-shoes"),
        getProductsByCategory("womens-watches"),
        getProductsByCategory("womens-bags"),
        getProductsByCategory("womens-jewellery"),
      ]);

      setProducts([
        ...tops,
        ...dresses,
        ...shoes,
        ...watches,
        ...bags,
        ...jewellery,
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);
  if (loading) {
    return <h2>Loading Products...</h2>;
  }

  return (
    <div className="men">

      {/* HERO */}
      <div className="image-card">

        <div className="image">
          <img
            src="https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Women's Fashion"
          />
        </div>

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

        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))
        ) : (
          <h2>No Products Found</h2>
        )}

      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

    </div>
  );
}