// jwt - authentication token to identify/represent a specific user on future requests
// jwt.sign(payload, secret, options)
// payload + secret = signature (server signs the token)
// Used to represent an already-authenticated identity on subsequent requests
// jwt is stored in browser cookie
// jwt secret is stored in server's environment variable (.env)

const jwt = require("jsonwebtoken");

const generateToken = (customerId) => {
    return jwt.sign(
        { id: customerId },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

module.exports = generateToken;

// here, customer id is stored in mongodb and represented in jwt payload
// JWT is stored in the browser as the value of an HttpOnly cookie named token
