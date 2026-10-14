import { Link, useNavigate } from "react-router-dom";
import { logoutCustomer } from "../services/api";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutCustomer();

            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    const { cartItems } = useCart();

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navbar">

            <Link to="/home" className="navbar-logo">
                ShopKart
            </Link>

            <div className="navbar-links">
                <Link to="/home">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/orders">My Orders</Link>
                <Link to="/cart">Cart ({totalItems})</Link>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

        </nav>
    );
};

export default Navbar;