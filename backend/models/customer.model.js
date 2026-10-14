// customer.model.js - defines how to interact with the database

// MONGODB is a document-oriented NOSQL database
// data structure - Collections
// Individual record - Document
// Data Format - BSON (binary-encoded format optimized for storage and fast traversal)
// flexible schema

// Mongoose - ODM library that lets you define a schema for MONGODB documents, then create a model
const mongoose = require("mongoose");

// A schema describes the structure of a customer document.
const customerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        wishlist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wishlist",
            default: null
        },

        cart: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    },
                    quantity: {
                        type: Number,
                        default: 1,
                        min: 1
                    }
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;


