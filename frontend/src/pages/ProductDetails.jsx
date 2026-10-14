import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addProductToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(id);

                setProduct(data.product);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addProductToCart(product._id);
        } catch (error) {
            setError(error.message || "Failed to add product to cart.");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="product-details-state">
                    <p>Loading product...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <div className="product-details-state">
                    <p>{error}</p>

                    <button
                        onClick={() => navigate("/products")}
                        className="back-button"
                    >
                        ← Back to Products
                    </button>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />

                <div className="product-details-state">
                    <p>Product not found.</p>

                    <button
                        onClick={() => navigate("/products")}
                        className="back-button"
                    >
                        ← Back to Products
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="product-details-page">

                <button
                    onClick={() => navigate("/products")}
                    className="back-button"
                >
                    ← Back to Products
                </button>

                <div className="product-details-card">

                    <div className="product-details-image-container">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-details-image"
                        />
                    </div>

                    <div className="product-details-info">

                        <p className="product-details-category">
                            {product.category}
                        </p>

                        <h1>{product.name}</h1>

                        <p className="product-details-description">
                            {product.description}
                        </p>

                        <div className="product-details-divider" />

                        <p className="product-details-price">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>

                        <div
                            className={
                                product.stock > 0
                                    ? "stock-badge in-stock"
                                    : "stock-badge out-of-stock"
                            }
                        >
                            {product.stock > 0
                                ? `✓ ${product.stock} units available`
                                : "Out of stock"}
                        </div>

                        <button
                            className="add-to-cart-button"
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                        >
                            {product.stock > 0
                                ? "Add to Cart"
                                : "Out of Stock"}
                        </button>

                    </div>

                </div>

            </main>
        </>
    );
};

export default ProductDetails;