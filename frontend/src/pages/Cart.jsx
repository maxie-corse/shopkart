import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        loading,
        error,
        mutating,
        updateProductQuantity,
        removeProductFromCart
    } = useCart();

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="products-state">
                    <p>Loading cart...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="products-state">
                    <p>{error}</p>
                </div>
            </>
        );
    }

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <div className="products-state">
                    <h2>Your cart is empty.</h2>
                    <p>Add some products to get started.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="cart-page">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p>Your selected products.</p>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item.product._id}>

                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="cart-item-image"
                                />

                                <div className="cart-item-info">
                                    <h2>{item.product.name}</h2>

                                    <p>
                                        ₹{item.product.price.toLocaleString("en-IN")}
                                    </p>

                                    <p>
                                        {item.product.stock} units available
                                    </p>

                                    <div className="cart-item-actions">

                                        <button
                                            onClick={() =>
                                                updateProductQuantity(
                                                    item.product._id,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={mutating || item.quantity <= 1}
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                updateProductQuantity(
                                                    item.product._id,
                                                    item.quantity + 1
                                                )
                                            }
                                            disabled={mutating || 
                                                item.quantity >= item.product.stock
                                            }
                                        >
                                            +
                                        </button>

                                        <button
                                            onClick={() =>
                                                removeProductFromCart(
                                                    item.product._id
                                                )
                                            }
                                            disabled={mutating}
                                        >
                                            Remove
                                        </button>

                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Total Items</span>
                            <span>{totalItems}</span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>
                                ₹{subtotal.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <button
                            className="checkout-button"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;