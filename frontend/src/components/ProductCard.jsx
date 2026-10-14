import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    addToWishlist,
    removeFromWishlist
} from "../services/api";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, isWishlisted, onWishlistChange }) => {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    const handleViewDetails = () => {
        navigate(`/products/${product._id}`);
    };

    const handleWishlistClick = async (event) => {
        event.stopPropagation();

        try {
            if (isWishlisted) {
                await removeFromWishlist(product._id);
                showMessage("Removed from wishlist");
            } else {
                await addToWishlist(product._id);
                showMessage("Added to wishlist");
            }

            onWishlistChange(product._id);
        } catch (error) {
            showMessage(
                error.message || "Something went wrong",
                "error"
            );
        }
    };

    const { addProductToCart, cartItems } = useCart();

    const cartItem = cartItems.find(
        (item) => item.product._id === product._id
    );

    const handleAddToCart = async () => {
        try {
            await addProductToCart(product._id);
            showMessage("Product added to cart");
        } catch (error) {
            showMessage(
                error.message || "Failed to add product to cart",
                "error"
            );
        }
    };

    return (
        <div className="product-card">

            {message && (
                <div
                    className={`product-toast ${
                        messageType === "error"
                            ? "product-toast-error"
                            : ""
                    }`}
                >
                    {message}
                </div>
            )}

            <div className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
            </div>

            <div className="product-info">

                <p className="product-category">
                    {product.category}
                </p>

                <h2>{product.name}</h2>

                <p className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                </p>

                <p className="product-stock">
                    {product.stock > 0
                        ? `${product.stock} units available`
                        : "Out of stock"}
                </p>

                <div className="product-actions">

                    <button className="view-details-button" onClick={handleViewDetails}>
                        View Details
                    </button>

                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        {cartItem
                            ? "Add Another"
                            : "Add to Cart"}
                    </button>

                    <button
                        onClick={handleWishlistClick}
                        className="wishlist-button"
                        aria-label={
                            isWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                    >
                        {isWishlisted ? "♥" : "♡"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProductCard;