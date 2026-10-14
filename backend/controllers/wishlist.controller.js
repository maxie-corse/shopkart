const mongoose = require("mongoose");

const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Wishlist = require("../models/wishlist.model");

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate Product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // 2. Check that the product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 3. Get the logged-in customer
        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 4. Find the customer's Wishlist
        let wishlist;

        if (customer.wishlist) {
            wishlist = await Wishlist.findById(customer.wishlist);
        }

        // 5. If the customer doesn't have a Wishlist yet, create one
        if (!wishlist) {
            wishlist = await Wishlist.create({
                customer: customer._id,
                products: []
            });

            // Store the Wishlist ID inside Customer
            customer.wishlist = wishlist._id;
            await customer.save();
        }

        // 6. Check for duplicate product
        const alreadyExists = wishlist.products.some(
            (id) => id.equals(product._id)
        );

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        // 7. Add product to Wishlist
        wishlist.products.push(product._id);

        await wishlist.save();

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate({
                path: "wishlist",
                populate: {
                    path: "products"
                }
            });

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const wishlist = customer.wishlist;

        return res.status(200).json({
            success: true,
            wishlist: wishlist ? wishlist.products : []
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate Product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // 2. Get logged-in customer
        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 3. Customer must have a Wishlist
        if (!customer.wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        // 4. Find Wishlist
        const wishlist = await Wishlist.findById(customer.wishlist);

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        // 5. Check whether product is actually in Wishlist
        const productExists = wishlist.products.some(
            (id) => id.equals(productId)
        );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not in wishlist"
            });
        }

        // 6. Remove the product
        wishlist.products = wishlist.products.filter(
            (id) => !id.equals(productId)
        );

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};