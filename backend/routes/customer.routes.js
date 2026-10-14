// customer.routes.js - used to define which URL goes to which function
// no actual function logic, just URL mapping

const express = require("express");

const {
    registerCustomer,
    loginCustomer,
    getProfile,
    logoutCustomer,
    changePassword
} = require("../controllers/customer.controller");

const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// not protected since user isn't logged in yet
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// protect middleware in the next routes
router.get("/me", protect, getProfile);
router.post("/logout", protect, logoutCustomer);
router.patch("/change-password", protect, changePassword);

module.exports = router;