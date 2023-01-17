const asyncHandler = require('express-async-handler');
const User = require('../models/user');
 
const registerUser = asyncHandler(
    async (req,res) => {
        const {name,email,password} = req.body;
        if(!name || !email || !password) {
            res.status(400);
            throw new Error("Fill in all the required fields");
        }
        if(password.length < 7) {
            res.status(400);
            throw new Error("Password lenght must be greater than 6 characters");
        }

        const userExisted = await User.findOne({email});
        if(userExisted) {
            res.status(400);
            throw new Error("Email already exists");
        }

        const user = await User.create(
            {
                name,
                email,
                password
            }
        );

        if(user) {
            const { _id,name,email,photo,phone,about } = user;
            res.status(201).json(
                {
                    _id,name,email,photo,phone,about
                }
            );
        }else {
            res.status(400);
            throw new Error("Invalid user data");
        }

    }
);

module.exports = {
    registerUser
};