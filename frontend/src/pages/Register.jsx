import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer } from "../services/api";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (
            !formData.fullName ||
            !formData.email ||
            !formData.password ||
            !formData.phone
        ) {
            setError("All fields are required");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            await registerCustomer(formData);

            navigate("/login");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Join ShopKart today</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>

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
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;