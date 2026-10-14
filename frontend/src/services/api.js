export const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(endpoint, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

export const registerCustomer = (customerData) => {
    return apiRequest("/customers/register", {
        method: "POST",
        body: JSON.stringify(customerData)
    });
};

export const loginCustomer = (credentials) => {
    return apiRequest("/customers/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });
};

export const getCurrentCustomer = () => {
    return apiRequest("/customers/me", {
        method: "GET"
    });
};

export const logoutCustomer = () => {
    return apiRequest("/customers/logout", {
        method: "POST"
    });
};

export const getProducts = (search = "", category = "") => {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (category) {
        params.append("category", category);
    }

    const queryString = params.toString();

    return apiRequest(
        `/api/products${queryString ? `?${queryString}` : ""}`
    );
};

export const getProductById = (id) => {
    return apiRequest(`/api/products/${id}`);
};

export const addToWishlist = (productId) =>
    apiRequest(`/api/wishlist/${productId}`, {
        method: "POST"
    });

export const getWishlist = () =>
    apiRequest("/api/wishlist");

export const removeFromWishlist = (productId) =>
    apiRequest(`/api/wishlist/${productId}`, {
        method: "DELETE"
    });

export const getCart = () => apiRequest("/api/cart");

export const addToCart = (productId) =>
    apiRequest(`/api/cart/${productId}`, {method: "POST"});

export const updateCartQuantity = (productId, quantity) =>
    apiRequest(`/api/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity })
    });

export const removeFromCart = (productId) =>
    apiRequest(`/api/cart/${productId}`, {
        method: "DELETE"
    });


export const getOrders = () => apiRequest("/api/orders");

export const getOrderById = (orderId) => apiRequest(`/api/orders/${orderId}`);