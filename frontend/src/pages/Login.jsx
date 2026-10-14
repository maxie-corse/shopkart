import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCustomer, getCurrentCustomer } from "../services/api";

const Login = () => {
    const navigate = useNavigate();

    const [checkingAuth, setCheckingAuth] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                await getCurrentCustomer();

                // User is already logged in
                navigate("/home");
            } catch (error) {
                // User is not logged in
                setCheckingAuth(false);
            }
        };

        checkLogin();
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            await loginCustomer(formData);

            navigate("/home");
        } catch (error) {
            setError("Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="products-state">
                <p>Checking authentication...</p>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Welcome Back</h1>

                <p>Login to your ShopKart account</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@gmail.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Your password"
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="auth-link">
                    Don't have an account?{" "}
                    <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 