import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const OrderConfirmation = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <>
                <Navbar />

                <div className="products-state">
                    <h2>Order information not found.</h2>
                    <Link to="/orders">View My Orders</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="order-confirmation-page">
                <div className="confirmation-success">
                    <div className="confirmation-check">
                        ✓
                    </div>

                    <h1>Order Placed Successfully!</h1>

                    <p>
                        Thank you for your purchase. Your order has
                        been successfully placed.
                    </p>
                </div>

                <div className="confirmation-card">
                    <div className="confirmation-order-header">
                        <div>
                            <h2>Order Summary</h2>

                            <p>
                                Order #{order._id}
                            </p>
                        </div>

                        <span className="confirmation-status">
                            {order.status}
                        </span>
                    </div>

                    <div className="confirmation-details">
                        <div className="confirmation-detail">
                            <span>Order Total</span>

                            <strong>
                                ₹
                                {order.totalAmount.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>
                        </div>

                        <div className="confirmation-detail">
                            <span>Payment</span>

                            <strong className="payment-paid">
                                {order.paymentStatus}
                            </strong>
                        </div>
                    </div>

                    <div className="confirmation-divider" />

                    <div className="shipping-summary">
                        <h2>Shipping Address</h2>

                        <p className="shipping-name">
                            {order.shippingAddress.fullName}
                        </p>

                        <p>
                            {order.shippingAddress.phone}
                        </p>

                        <p>
                            {order.shippingAddress.addressLine1}
                        </p>

                        <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}
                        </p>

                        <p>
                            {order.shippingAddress.pincode}
                        </p>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <Link
                        to="/orders"
                        className="confirmation-primary-button"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/products"
                        className="confirmation-secondary-button"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        </>
    );
};

export default OrderConfirmation;