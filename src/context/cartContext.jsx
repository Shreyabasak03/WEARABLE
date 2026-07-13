// context/CartContext.jsx

import { createContext, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {

    const [cart, setCart] = useState([]);

    const addToCart = (product) => {

        const exist = cart.find(item => item.id === product.id);

        if(exist){

            setCart(
                cart.map(item =>
                    item.id === product.id
                        ? {...item, quantity:item.quantity+1}
                        : item
                )
            );

        }else{

            setCart([
                ...cart,
                {...product, quantity:1}
            ]);

        }

    };

    const removeFromCart = (id)=>{
        setCart(cart.filter(item=>item.id!==id));
    }

    const increaseQuantity=(id)=>{

        setCart(
            cart.map(item=>
                item.id===id
                    ? {...item, quantity:item.quantity+1}
                    : item
            )
        )

    }

    const decreaseQuantity=(id)=>{

        setCart(
            cart.map(item=>
                item.id===id
                    ? {...item, quantity:item.quantity-1}
                    : item
            ).filter(item=>item.quantity>0)
        )

    }

    return(

        <CartContext.Provider
        value={{
            cart,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity
        }}
        >

            {children}

        </CartContext.Provider>

    )

}