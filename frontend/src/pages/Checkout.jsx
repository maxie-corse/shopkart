import { useState, useEffect } from "react";
import { apiRequest } from "../services/api.js";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Checkout = () => {
    const navigate = useNavigate();
    const { refreshCart } = useCart();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            pincode
        } = formData;

        if (
            !fullName.trim() ||
            !phone.trim() ||
            !addressLine1.trim() ||
            !city.trim() ||
            !state.trim() ||
            !pincode.trim()
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            setError("Phone number must contain 10 digits.");
            return;
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            setError("Pincode must contain 6 digits.");
            return;
        }

        try {
            setLoading(true);

            const data = await apiRequest(
                "/api/orders/create-payment-order",
                {
                    method: "POST",
                    body: JSON.stringify({
                        shippingAddress: {
                            fullName: fullName.trim(),
                            phone: phone.trim(),
                            addressLine1: addressLine1.trim(),
                            city: city.trim(),
                            state: state.trim(),
                            pincode: pincode.trim()
                        }
                    })
                }
            );

            console.log("Payment order created:", data);

            openRazorpayCheckout(data);
        } catch (error) {
            console.error("Checkout error:", error);

            setError(
                error.message || "Failed to create payment order."
            );

            setLoading(false);
        }
    };

    const openRazorpayCheckout = (paymentData) => {
        const options = {
            key: paymentData.key,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: "ShopKart",
            description: "ShopKart Order",
            order_id: paymentData.razorpayOrderId,

            handler: async function (response) {
                console.log(
                    "Razorpay payment response:",
                    response
                );

                try {
                    const verificationData = await apiRequest(
                        "/api/orders/verify-payment",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                razorpay_order_id:
                                    response.razorpay_order_id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_signature:
                                    response.razorpay_signature,
                                shopKartOrderId:
                                    paymentData.shopKartOrderId
                            })
                        }
                    );

                    console.log(
                        "Payment verification response:",
                        verificationData
                    );

                    await refreshCart();

                    const orderData = await apiRequest(
                        `/api/orders/${verificationData.orderId}`
                    );

                    navigate("/order-confirmation", {
                        state: {
                            order: orderData.order
                        }
                    });
                } catch (error) {
                    console.error(
                        "Payment verification failed:",
                        error
                    );

                    setError(
                        error.message ||
                            "Payment verification failed."
                    );

                    setLoading(false);
                }
            },

            prefill: {
                name: formData.fullName,
                contact: formData.phone
            },

            theme: {
                color: "#3399cc"
            }
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();

        setLoading(false);
    };

    return (
        <>
            <Navbar />

            <main className="checkout-page">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <p>
                        Enter your shipping details to continue
                        to payment.
                    </p>
                </div>

                <div className="checkout-card">
                    <div className="checkout-form-section">
                        <h2>Shipping Information</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="checkout-form-group">
                                <label htmlFor="fullName">
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="checkout-form-group">
                                <label htmlFor="phone">
                                    Phone Number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="10-digit phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    maxLength="10"
                                />
                            </div>

                            <div className="checkout-form-group">
                                <label htmlFor="addressLine1">
                                    Address
                                </label>

                                <input
                                    id="addressLine1"
                                    type="text"
                                    name="addressLine1"
                                    placeholder="House number, street, area"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="checkout-form-row">
                                <div className="checkout-form-group">
                                    <label htmlFor="city">
                                        City
                                    </label>

                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="checkout-form-group">
                                    <label htmlFor="state">
                                        State
                                    </label>

                                    <input
                                        id="state"
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="checkout-form-group">
                                <label htmlFor="pincode">
                                    Pincode
                                </label>

                                <input
                                    id="pincode"
                                    type="text"
                                    name="pincode"
                                    placeholder="6-digit pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    maxLength="6"
                                />
                            </div>

                            {error && (
                                <div className="checkout-error">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="checkout-payment-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Preparing Payment..."
                                    : "Continue to Payment"}
                            </button>
                        </form>
                    </div>

                    <div className="checkout-info-section">
                        <div className="checkout-info-icon">
                            🔒
                        </div>

                        <h2>Secure Payment</h2>

                        <p>
                            Your payment will be securely
                            processed through Razorpay.
                        </p>

                        <div className="checkout-info-divider" />

                        <div className="checkout-info-item">
                            <span>✓</span>
                            <p>Secure payment processing</p>
                        </div>

                        <div className="checkout-info-item">
                            <span>✓</span>
                            <p>Your payment details are protected</p>
                        </div>

                        <div className="checkout-info-item">
                            <span>✓</span>
                            <p>Order confirmation after payment</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Checkout;