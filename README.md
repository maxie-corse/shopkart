# ShopKart 🛒

A full-stack e-commerce web application built using the MERN stack as part of the Engineering Labs at Scaler School of Technology. ShopKart provides a complete shopping experience, from browsing products and managing a wishlist to adding items to a cart, completing checkout with Razorpay Test Mode, and viewing order history.

## ✨ Features

### Authentication
- Customer registration and login
- JWT-based authentication using HttpOnly cookies
- Protected API routes
- Logout functionality

### Product Catalogue
- Browse products fetched from MongoDB
- Product details pages
- Product search and category filtering
- Product stock information
- Cloudinary-hosted product images

### Wishlist
- Add and remove products from a wishlist
- Persistent, customer-specific wishlist
- Wishlist data populated with product information

### Shopping Cart
- Add products to the cart
- Increase and decrease product quantities
- Remove products from the cart
- Stock validation
- Persistent cart stored in MongoDB
- Shared cart state using React Context API
- Dynamically calculated subtotal and navbar cart count

### Checkout and Orders
- Shipping address form with validation
- Server-side price and stock validation
- Razorpay Test Mode payment integration
- Server-side payment signature verification
- Persistent order history
- Order confirmation and detailed order pages
- Cart clearing after successful payment verification

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Routing | React Router |
| State Management | React Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), HttpOnly cookies |
| Image Storage | Cloudinary, Multer |
| Payments | Razorpay Test Mode |
| API Testing | Postman |
| Version Control | Git, GitHub |

## 📁 Project Structure

```text
ShopKart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js and npm](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance
- A [Cloudinary](https://cloudinary.com/) account for image uploads
- A [Razorpay](https://razorpay.com/) account for test payments

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/shopkart.git
cd shopkart
```

Replace `YOUR_USERNAME` with the GitHub account that owns the repository.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Replace the placeholder values with your own credentials. Use Razorpay Test Mode credentials for testing.

Start the backend using the script configured in `backend/package.json`. For example, if the project defines a `start` script:

```bash
npm start
```

If it defines a development script, you can use:

```bash
npm run dev
```

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.

The frontend must be configured to send API requests to the backend running on port 5000, using the existing Vite development proxy or the appropriate API base URL configuration.

### 4. Database setup

Configure your MongoDB connection string in `MONGO_URI`. Ensure your database is accessible to the backend and that MongoDB Atlas network access permits connections from your development environment.

Product documents should be available in the database for the product catalogue to display products.

## Main API Endpoints

The endpoints below require authentication unless stated otherwise.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customers/register` | Register a customer |
| POST | `/customers/login` | Log in |
| GET | `/customers/me` | Fetch the authenticated customer |
| POST | `/customers/logout` | Log out |
| GET | `/api/products` | Fetch products |
| GET | `/api/products/:id` | Fetch a product |
| GET | `/api/wishlist` | Fetch wishlist |
| POST | `/api/wishlist/:productId` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |
| GET | `/api/cart` | Fetch cart |
| POST | `/api/cart/:productId` | Add to cart |
| PATCH | `/api/cart/:productId` | Update cart quantity |
| DELETE | `/api/cart/:productId` | Remove cart item |
| POST | `/api/orders/create-payment-order` | Create checkout/payment order |
| POST | `/api/orders/verify-payment` | Verify payment |
| GET | `/api/orders` | Fetch order history |
| GET | `/api/orders/:id` | Fetch order details |

*Note: The frontend's Vite proxy and backend route mounting determine the final local request URLs. Refer to the source code when configuring a deployment.*

## Payment Testing

ShopKart integrates Razorpay Standard Checkout in Test Mode.

- Configure test API keys in the backend environment.
- Use Razorpay's official test payment credentials and supported test flows.
- Never use real payment credentials for development testing.
- Never expose the Razorpay Key Secret in frontend code or commit it to GitHub.

Payment success is handled through backend signature verification before the order is marked as paid and the cart is cleared.

## What I Learned

Building ShopKart helped me understand how individual frontend and backend components work together to form a full-stack application.

- **REST API development:** Designing and implementing CRUD endpoints using Express.js.
- **Database modelling:** Using Mongoose schemas, ObjectId references, and populated documents to represent relationships between customers, products, wishlists, carts, and orders.
- **Authentication and authorization:** Implementing JWT authentication, HttpOnly cookies, protected routes, and customer-specific resources.
- **React state management:** Using Context API to share cart state and keep the Navbar, product cards, and cart page synchronised.
- **Derived state:** Calculating cart totals and item counts from existing data rather than storing redundant values.
- **Business-rule validation:** Validating quantities, product stock, request data, and checkout totals on the backend.
- **Frontend/backend integration:** Connecting React components to Express APIs and handling loading, error, and empty states.
- **Payment integration:** Understanding server-created payment orders, Razorpay checkout, signature verification, and payment status handling.
- **Order management:** Creating persistent order records with snapshots of purchased products and prices.
- **File uploads:** Integrating Multer and Cloudinary for product image uploads.
- **Debugging and testing:** Using Postman, browser developer tools, server logs, and error responses to diagnose issues.
- **Code organisation:** Separating routes, controllers, models, API services, React components, context, and styles into maintainable modules.

## Security

- Environment files containing credentials are excluded from version control.
- Authentication secrets and payment credentials must be configured through environment variables.
- Protected APIs derive customer identity from verified authentication rather than trusting client-supplied user IDs.
- Backend validation is used for important business rules.
- Payment status depends on server-side signature verification.

## Deployment

Deployment information will be added once the frontend and backend are hosted and verified.

- **Live application:** Add the verified frontend URL here.
- **Backend API:** Add the verified backend URL here.
