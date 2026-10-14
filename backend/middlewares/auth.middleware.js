// auth.middleware.js - used to decide whether the request should be allowed to continue

const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");

// next - continue to the next middleware/handler
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // jwt verification - server asks was this token signed using my secret, and is it still valid?
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find customer that matches the decoded id from mongodb records
        // exclude password field from the returned document
        const customer = await Customer.findById(decoded.id).select("-password");

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        req.user = customer;

        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
};

module.exports = protect;