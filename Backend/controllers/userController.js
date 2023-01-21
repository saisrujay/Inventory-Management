const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
};

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


        //Create a new user if email doesn't exist
        const user = await User.create(
            {
                name : name,
                email : email,
                password : password
            }
        );
        
        //Generate token
        const token = generateToken(user._id)

        //send HTTP-only cookie
        res.cookie('token',token,{
            path : '/',
            httpOnly : true,
            expires : new Date(Date.now() + 1000 * 86400),
            sameSite : 'none',
            secure : true,
        });

        if(user) {
            const { _id,name,email,photo,phone,about } = user;
            res.status(201).json(
                {
                    _id,name,email,photo,phone,about,token,
                }
            );
        }
        else {
            res.status(400);
            throw new Error("Invalid user data");
        }

    }
);

module.exports = {
    registerUser
};