const express = require("express");

const {
    createProduct,
    getAllProducts,
    getProductById
} = require("../controllers/product.controller");

const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/", upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;