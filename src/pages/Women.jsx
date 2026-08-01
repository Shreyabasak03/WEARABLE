import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import { getProductsByCategory } from "../api/productsApi";
import { useCart } from "../context/cartContext";
import "./Men.css";

export default function Men() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const categories = [
    "Men's Shirts",
    "Men's Shoes",
    "Men's Watches",
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
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600&auto=format&fit=crop"
            alt="Men's Fashion"
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