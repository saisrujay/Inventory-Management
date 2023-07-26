const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const protect = asyncHandler (async (req, res, next) => {
    try {
        // By accessing req.cookies.token, the code retrieves the value of the 'token' cookie from the incoming request
        const token = req.cookies.token;
        if(!token) {
            res.status(401)
            throw new Error("Not authorized, please login")
        }

        //Verify Token
        // verify method is used to verify the authenticity and integrity of a JWT.
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        
        //Get userid form token
        const user = await User.findById(verified.id).select("-password")

        if(!user) {
            res.status(401)
            throw new Error("User Not found")
        }
        // This line assigns the retrieved user object to the req.user property. It is common practice to attach the user information to the req object for later use in subsequent middleware or route handlers.
        req.user = user
        //  This line calls the next function, which is typically used to pass control to the next middleware or route handler in the request processing pipeline. 
        // It allows the execution to proceed to the next step in the code flow.
        next()
    }  catch (error) {
        res.status(401)
            throw new Error("Not authorized, please login")
    }
});

module.exports = {
    protect 
};