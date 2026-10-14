const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // 2. Check that product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 3. Get the currently logged-in customer
        const customer = await Customer.findById(req.user._id);

        // 4. Check whether product is already in cart
        const existingItem = customer.cart.find(
            (item) => item.product.equals(product._id)
        );

        if (existingItem) {
            // Product already exists → increase quantity
            const newQuantity = existingItem.quantity + 1;

            // 5. Don't exceed stock
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot add more than available stock"
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            // Product isn't in cart → first quantity is 1
            if (product.stock < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock"
                });
            }

            customer.cart.push({
                product: product._id,
                quantity: 1
            });
        }

        // 6. Save customer's updated cart
        await customer.save();

        // 7. Populate product details before sending response
        await customer.populate("cart.product");

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: customer.cart
        });

    } catch (error) {
        console.error("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate("cart.product");

        return res.status(200).json({
            success: true,
            cart: customer.cart
        });

    } catch (error) {
        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // 2. Validate quantity
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // 3. Check that product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 4. Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Quantity exceeds available stock"
            });
        }

        // 5. Get current customer
        const customer = await Customer.findById(req.user._id);

        // 6. Find product in cart
        const cartItem = customer.cart.find(
            (item) => item.product.equals(product._id)
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        // 7. Update quantity
        cartItem.quantity = quantity;

        // 8. Save
        await customer.save();

        // 9. Populate product details
        await customer.populate("cart.product");

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: customer.cart
        });

    } catch (error) {
        console.error("Update cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // 2. Get current customer
        const customer = await Customer.findById(req.user._id);

        // 3. Find product in cart
        const cartItemIndex = customer.cart.findIndex(
            (item) => item.product.equals(productId)
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        // 4. Remove item from cart
        customer.cart.splice(cartItemIndex, 1);

        // 5. Save
        await customer.save();

        // 6. Populate product details
        await customer.populate("cart.product");

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart
        });

    } catch (error) {
        console.error("Remove from cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
};