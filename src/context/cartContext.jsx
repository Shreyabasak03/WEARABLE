import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // Load cart from localStorage when app starts
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart whenever cartItems changes
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);


  // ADD TO CART
  const addToCart = (product, quantity = 1) => {

    setCartItems((prevItems) => {

      const existingProduct = prevItems.find(
        (item) => item.id === product.id
      );

      // Product already exists
      if (existingProduct) {

        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      // New product
      return [
        ...prevItems,
        {
          ...product,
          quantity,
        },
      ];
    });
  };


  // INCREASE QUANTITY
  const increaseQuantity = (id) => {

    setCartItems((prevItems) =>
      prevItems.map((item) => {

        if (item.id === id) {

          if (item.quantity >= item.stock) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return item;
      })
    );
  };


  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {

    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };


  // REMOVE PRODUCT
  const removeFromCart = (id) => {

    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== id
      )
    );
  };


  // CLEAR CART
  const clearCart = () => {
    setCartItems([]);
  };


  // TOTAL PRICE
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) * item.quantity,
    0
  );


  // TOTAL QUANTITY
  const totalItems = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  return useContext(CartContext);
};