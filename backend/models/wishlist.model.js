const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            unique: true
        },

        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;