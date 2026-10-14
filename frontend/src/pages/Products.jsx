import { useEffect, useState } from "react";
import {
    getProducts,
    getWishlist
} from "../services/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProducts(search, category);

                setProducts(data.products);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, category]);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await getWishlist();

                const ids = data.wishlist.map(
                    (product) => product._id
                );

                setWishlistIds(ids);
            } catch (error) {
                console.error("Could not load wishlist:", error);
            }
        };

        fetchWishlist();
    }, []);

    const handleWishlistChange = (productId) => {
        setWishlistIds((currentIds) => {
            if (currentIds.includes(productId)) {
                return currentIds.filter(
                    (id) => id !== productId
                );
            }

            return [...currentIds, productId];
        });
    };

    if (loading) {
        return (
            <div className="products-state">
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-state">
                <p>Something went wrong while loading products.</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="products-page">
                <div className="products-header">
                    <h1>Discover Products</h1>
                    <p>Find something you'll love from our collection.</p>
                </div>

                <div className="product-filters">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Books">Books</option>
                        <option value="Home">Home</option>
                    </select>
                </div>

                {products.length === 0 ? (
                    <div className="products-state">
                        <p>No products found.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                isWishlisted={wishlistIds.includes(product._id)}
                                onWishlistChange={handleWishlistChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Products;