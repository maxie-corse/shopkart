import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, updateCartQuantity, removeFromCart } from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mutating, setMutating] = useState(false);
    const [error, setError] = useState("");

    const refreshCart = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCart();

            setCartItems(data.cart);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addProductToCart = async (productId) => {
        try {
            setMutating(true);
            setError("");

            const data = await addToCart(productId);

            setCartItems(data.cart);
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setMutating(false);
        }
    };

    const updateProductQuantity = async (productId, quantity) => {
        try {
            setMutating(true);
            setError("");

            const data = await updateCartQuantity(productId, quantity);

            setCartItems(data.cart);
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setMutating(false);
        }
    };

    const removeProductFromCart = async (productId) => {
        try {
            setMutating(true);
            setError("");

            const data = await removeFromCart(productId);

            setCartItems(data.cart);
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setMutating(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider
            value={{  
                cartItems,
                setCartItems,
                loading,
                setLoading,
                mutating,
                error,
                setError,
                refreshCart,
                addProductToCart,
                updateProductQuantity,
                removeProductFromCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};