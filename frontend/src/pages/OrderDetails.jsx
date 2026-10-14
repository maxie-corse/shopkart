import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOrderById } from "../services/api";

const OrderDetails = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id);
                setOrder(data.order);
            } catch (error) {
                console.error("Failed to fetch order:", error);

                setError(
                    error.message || "Failed to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="orders-state">
                    <p>Loading order...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <div className="orders-state">
                    <h2>Couldn't load order</h2>
                    <p>{error}</p>

                    <Link to="/orders">
                        Back to My Orders
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="order-details-page">

                <Link
                    to="/orders"
                    className="order-details-back"
                >
                    ← Back to My Orders
                </Link>

                <div className="order-details-header">
                    <div>
                        <h1>Order Details</h1>

                        <p className="order-details-id">
                            Order #{order._id}
                        </p>

                        <p className="order-details-date">
                            Placed on{" "}
                            {new Date(
                                order.createdAt
                            ).toLocaleString("en-IN")}
                        </p>
                    </div>

                    <span className="order-details-status">
                        {order.status}
                    </span>
                </div>

                <div className="order-details-grid">

                    <div className="order-details-main">

                        <section className="order-details-card">
                            <h2>Items</h2>

                            <div className="order-items">
                                {order.items.map((item) => (
                                    <div
                                        className="order-item"
                                        key={item._id}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                        />

                                        <div className="order-item-info">
                                            <h3>{item.name}</h3>

                                            <p className="order-item-price">
                                                ₹
                                                {item.price.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                            <p>
                                                Quantity:{" "}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <strong className="order-item-total">
                                            ₹
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="order-details-card">
                            <h2>Shipping Address</h2>

                            <div className="shipping-details">
                                <p className="shipping-name">
                                    {
                                        order.shippingAddress
                                            .fullName
                                    }
                                </p>

                                <p>
                                    {
                                        order.shippingAddress
                                            .phone
                                    }
                                </p>

                                <p>
                                    {
                                        order.shippingAddress
                                            .addressLine1
                                    }
                                </p>

                                <p>
                                    {
                                        order.shippingAddress
                                            .city
                                    }
                                    ,{" "}
                                    {
                                        order.shippingAddress
                                            .state
                                    }
                                </p>

                                <p>
                                    {
                                        order.shippingAddress
                                            .pincode
                                    }
                                </p>
                            </div>
                        </section>

                    </div>

                    <aside className="order-details-sidebar">

                        <div className="order-details-card">
                            <h2>Order Summary</h2>

                            <div className="order-summary-row">
                                <span>Payment Status</span>

                                <strong className="payment-paid">
                                    {order.paymentStatus}
                                </strong>
                            </div>

                            <div className="order-summary-row">
                                <span>Order Status</span>

                                <strong>
                                    {order.status}
                                </strong>
                            </div>

                            <div className="order-summary-divider" />

                            <div className="order-summary-total">
                                <span>Total</span>

                                <strong>
                                    ₹
                                    {order.totalAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>
                        </div>

                    </aside>

                </div>

            </main>
        </>
    );
};

export default OrderDetails;