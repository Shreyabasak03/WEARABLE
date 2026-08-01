import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import { getProductsByCategory } from "../api/ProductsApi";
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
        // Fetch all categories to search across the catalog
        const [shirts, shoes, watches] = await Promise.all([
          getProductsByCategory("mens-shirts"),
          getProductsByCategory("mens-shoes"),
          getProductsByCategory("mens-watches"),
        ]);

        const allProducts = [...shirts, ...shoes, ...watches];

        // Filter by title, brand, or category
        const filtered = allProducts.filter((item) => {
          const searchLower = query.toLowerCase();
          return (
            item.title?.toLowerCase().includes(searchLower) ||
            item.brand?.toLowerCase().includes(searchLower) ||
            item.category?.toLowerCase().includes(searchLower)
          );
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Error searching products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
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
        <h3>Searching products...</h3>
      ) : products.length > 0 ? (
        <div className="cards-container" style={{ marginTop: "30px" }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>
      ) : (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h3>No products found matching "{query}"</h3>
          <p>Try searching for terms like "shirt", "shoes", or "watch".</p>
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