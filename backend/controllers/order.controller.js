const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shopKartOrderId
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !shopKartOrderId
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is incomplete"
            });
        }

        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            order.paymentStatus = "FAILED";
            await order.save();

            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed"
            });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        // Clear the customer's cart after successful payment
        await Customer.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    cart: []
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            orderId: order._id
        });

    } catch (error) {
        console.error("Payment verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        // 1. Validate shipping address
        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            pincode
        } = shippingAddress;

        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !addressLine1?.trim() ||
            !city?.trim() ||
            !state?.trim() ||
            !pincode?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All shipping fields are required"
            });
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Phone number must contain 10 digits"
            });
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: "Pincode must contain 6 digits"
            });
        }

        // 2. Load the authenticated customer and their cart
        const customer = await Customer.findById(req.user._id)
            .populate("cart.product");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // 3. Cart cannot be empty
        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // 4. Build order snapshot using latest Product data
        const orderItems = [];
        let totalAmount = 0;

        for (const cartItem of customer.cart) {
            const product = cartItem.product;

            // Product was deleted after being added to cart
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "A product in your cart no longer exists"
                });
            }

            // 5. Final stock verification
            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            // 6. Create purchase-time product snapshot
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            });

            // 7. Calculate total on the server
            totalAmount += product.price * cartItem.quantity;
        }

        totalAmount = Math.round(totalAmount * 100) / 100;

        // 8. Create ShopKart pending order
        const order = await Order.create({
            user: customer._id,
            items: orderItems,
            shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine1: addressLine1.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim()
            },
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        });

        try {
            // 9. Create Razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: order._id.toString()
            });

            // 10. Save Razorpay Order ID
            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            // 11. Return safe checkout information
            return res.status(201).json({
                success: true,
                shopKartOrderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            });

        } catch (razorpayError) {
            // Razorpay order failed, so remove the pending ShopKart order.
            await Order.findByIdAndDelete(order._id);

            console.error("Razorpay order creation error:", razorpayError);

            return res.status(500).json({
                success: false,
                message: "Failed to create payment order"
            });
        }

    } catch (error) {
        console.error("Create payment order error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Get order by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById
};