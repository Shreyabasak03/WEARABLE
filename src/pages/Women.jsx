import React, { useState } from "react";

import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";

import products from "../data/product.js";

import "./Men.css";

export default function Men() {

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [cart, setCart] = useState(() => {

    const savedCart =
      localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });


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


  // -----------------------
  // ADD TO CART
  // -----------------------

  const addToCart = (product, quantity) => {

    setCart((previousCart) => {

      const existingProduct =
        previousCart.find(
          (item) => item.id === product.id
        );


      let updatedCart;


      if (existingProduct) {

        updatedCart =
          previousCart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
                }
              : item
          );

      } else {

        updatedCart = [
          ...previousCart,
          {
            ...product,
            quantity,
          },
        ];

      }


      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );


      return updatedCart;

    });

  };


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


      {/* PRODUCTS */}

      <div className="cards-container">

        {products.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={
              setSelectedProduct
            }
          />

        ))}

      </div>


      {/* PRODUCT DETAILS MODAL */}

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