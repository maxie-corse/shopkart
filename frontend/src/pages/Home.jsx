import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentCustomer } from "../services/api";

const Home = () => {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const data = await getCurrentCustomer();

                setCustomer(data);
            } catch (error) {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [navigate]);

    if (loading) {
        return <p className="loading">Loading...</p>;
    }

    if (!customer) {
        return null;
    }

    return (
        <>
            <Navbar />

            <main className="home-page">
                <div className="profile-card">
                    <h1>Welcome, {customer.fullName}!</h1>

                    <div className="profile-info">
                        <p>
                            <strong>Name:</strong>{" "}
                            {customer.fullName}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {customer.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>{" "}
                            {customer.phone}
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;