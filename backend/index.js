// index.js - used to start and configure the server

// load .env into this file
require("dotenv").config();

// right now the type of module system is commonJS (CJS), use ESM for import
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

// create express application
const express = require("express");
const app = express();

// allows express to understand JSON request bodies (req.body)
app.use(express.json());
// Parse the cookies that arrived in the HTTP request and make them conveniently available to Express.
// req.cookies instead of manually parsing HTTP request header
app.use(cookieParser());

// mount the routes so we don't have to write /customers every single time
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");

    // listen for incoming network connections on port 5000
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed:", error);
});

