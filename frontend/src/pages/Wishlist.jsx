import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getWishlist,
    removeFromWishlist
} from "../services/api";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getWishlist();

                setWishlist(data.wishlist);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    (product) => product._id !== productId
                )
            );
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <Navbar />

            <div className="wishlist-page">

                <div className="wishlist-header">
                    <h1>My Wishlist</h1>
                    <p>Your saved products.</p>
                </div>

                {loading && (
                    <div className="products-state">
                        <p>Loading wishlist...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="products-state">
                        <p>
                            Something went wrong while loading your wishlist.
                        </p>
                    </div>
                )}

                {!loading && !error && wishlist.length === 0 && (
                    <div className="products-state">
                        <p>Your wishlist is empty.</p>
                    </div>
                )}

                {!loading && !error && wishlist.length > 0 && (
                    <div className="products-grid">

                        {wishlist.map((product) => (
                            <div
                                className="product-card"
                                key={product._id}
                            >

                                <div className="product-image-container">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </div>

                                <div className="product-info">

                                    <p className="product-category">
                                        {product.category}
                                    </p>

                                    <h2>{product.name}</h2>

                                    <p className="product-price">
                                        ₹{product.price.toLocaleString("en-IN")}
                                    </p>

                                    <p className="product-stock">
                                        {product.stock > 0
                                            ? `${product.stock} units available`
                                            : "Out of stock"}
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleRemove(product._id)
                                        }
                                    >
                                        Remove from Wishlist
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </>
    );
};

export default Wishlist;