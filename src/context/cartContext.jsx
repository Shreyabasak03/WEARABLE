import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // ==========================================
  // LOAD CART FROM LOCAL STORAGE
  // ==========================================

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });


  // ==========================================
  // SAVE CART TO LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);


  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (
    product,
    quantity = 1
  ) => {

    setCartItems((prevItems) => {

      // MongoDB uses _id
      const productId = product._id;

      const existingProduct =
        prevItems.find(
          (item) =>
            item.id === productId
        );


      // ========================================
      // PRODUCT ALREADY IN CART
      // ========================================

      if (existingProduct) {

        return prevItems.map((item) =>

          item.id === productId
            ? {
                ...item,

                quantity: Math.min(
                  item.quantity + quantity,
                  item.stock
                ),
              }
            : item

        );
      }


      // ========================================
      // NEW PRODUCT
      // ========================================

      return [

        ...prevItems,

        {
          id: product._id,

          name: product.name,

          image: product.image,

          brand: product.brand,

          category: product.category,

          price: product.price,

          stock: product.stock,

          quantity: Math.min(
            quantity,
            product.stock
          ),
        },

      ];

    });

  };


  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (id) => {

    setCartItems((prevItems) =>

      prevItems.map((item) => {

        if (item.id !== id) {
          return item;
        }

        if (
          item.quantity >=
          item.stock
        ) {
          return item;
        }

        return {
          ...item,

          quantity:
            item.quantity + 1,
        };

      })

    );

  };


  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (id) => {

    setCartItems((prevItems) =>

      prevItems

        .map((item) =>

          item.id === id
            ? {
                ...item,

                quantity:
                  item.quantity - 1,
              }
            : item

        )

        .filter(
          (item) =>
            item.quantity > 0
        )

    );

  };


  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const removeFromCart = (id) => {

    setCartItems((prevItems) =>

      prevItems.filter(
        (item) =>
          item.id !== id
      )

    );

  };


  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setCartItems([]);
  };


  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,

      0
    );


  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,

      0
    );


  // ==========================================
  // CONTEXT
  // ==========================================

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


// ==========================================
// USE CART
// ==========================================

export const useCart = () =>
  useContext(CartContext);