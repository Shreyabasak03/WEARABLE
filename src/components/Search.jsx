import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import { getAllProducts } from "../api/ProductsApi";
import { useCart } from "../context/cartContext";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        // 1. Fetch all products from your database
        const allProducts = (await getAllProducts()) || [];

        // 2. Filter across name, description, category, and brand
        const searchLower = query.toLowerCase().trim();

        const filtered = allProducts.filter((item) => {
          const name = (item.name || item.title || "").toLowerCase();
          const brand = (item.brand || "").toLowerCase();
          const category = (item.category || "").toLowerCase();
          const description = (item.description || "").toLowerCase();

          return (
            name.includes(searchLower) ||
            brand.includes(searchLower) ||
            category.includes(searchLower) ||
            description.includes(searchLower)
          );
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Error searching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      fetchAndFilterProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>
        Search Results for: <span style={{ color: "#1f7b70" }}>"{query}"</span>
      </h2>

      {loading ? (
        <h3 style={{ marginTop: "20px" }}>Searching products...</h3>
      ) : products.length > 0 ? (
        <div className="cards-container" style={{ marginTop: "30px" }}>
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>
      ) : (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h3>No products found matching "{query}"</h3>
          <p style={{ color: "#666", marginTop: "8px" }}>
            Try searching with different keywords like shirts, pants, or brand names.
          </p>
        </div>
      )}

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