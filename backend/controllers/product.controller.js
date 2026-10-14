const mongoose = require("mongoose");
const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "shopkart/products",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        // Check required fields
        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });
        }

        // Validate price
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        // Validate stock
        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer);

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: uploadResult.secure_url,
            stock
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        const query = {};

        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            query.category = category;
        }

        let sortOption = {};

        if (sort === "price_asc") {
            sortOption.price = 1;
        }

        if (sort === "price_desc") {
            sortOption.price = -1;
        }

        const products = await Product.find(query).sort(sortOption);

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
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
    createProduct,
    getAllProducts,
    getProductById
};