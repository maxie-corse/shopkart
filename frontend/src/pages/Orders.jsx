import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOrders } from "../services/api";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data.orders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setError(
                    error.message || "Failed to load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="orders-state">
                    <p>Loading your orders...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <div className="orders-state">
                    <h2>Couldn't load orders</h2>
                    <p>{error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="orders-page">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>
                        View your previous orders and track their
                        status.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="orders-empty">
                        <div className="orders-empty-icon">
                            🛍️
                        </div>

                        <h2>No orders yet</h2>

                        <p>
                            Your completed orders will appear
                            here.
                        </p>

                        <Link
                            to="/products"
                            className="orders-shop-button"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div
                                className="order-card"
                                key={order._id}
                            >
                                <div className="order-card-header">
                                    <div>
                                        <h2>
                                            Order #{order._id}
                                        </h2>

                                        <p className="order-date">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </div>

                                    <span className="order-status-badge">
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-card-divider" />

                                <div className="order-card-info">
                                    <div>
                                        <span>
                                            Order Total
                                        </span>

                                        <strong>
                                            ₹
                                            {order.totalAmount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Payment
                                        </span>

                                        <strong className="order-payment-status">
                                            {order.paymentStatus}
                                        </strong>
                                    </div>

                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="order-details-button"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};

export default Orders;