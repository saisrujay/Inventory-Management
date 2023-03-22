const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

});

//Login User
const loginUser = asyncHandler(
    async (req,res) => {
        const {email,password} = req.body;

        //Validate request
        if(!email ||!password) {
            res.status(400);
            throw new Error("Please add email and password");
        }
        
        //Check if user exists
        const user = await User.findOne({email});

        //If the user doesn't exist, throw an error
        if(!user) {
            res.status(400);
            throw new Error("User not found, please signup");
        }

        //IF the user already exists, check if the entered password is matching
        const passwordIsCorrect = await bcrypt.compare(password,user.password);

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

        //If user exists and password matches
        if(user && passwordIsCorrect){
            const { _id,name,email,photo,phone,about } = user;
            res.status(200).json(
                {
                    _id,name,email,photo,phone,about,token,
                }
            );
        }
        else{           //If user does not exist or password doesn't match
            res.status(400);
            throw new Error("Invalid email or password");
        }

});

//Logout user
const logout = asyncHandler(
    async(req,res) => {
        res.cookie('token',"",{
            path : '/',
            httpOnly : true,
            expires : new Date(0),
            sameSite : 'none',
            secure : true,
        });
        return res.status(200).json({message: "Successfully logged out"});
});

//Get User Data
const getUser = asyncHandler(
    async(req,res) => {
        const user = await User.findById(req.user._id)

        if(user) {
            const { _id,name,email,photo,phone,about } = user;
            res.status(200).json(
                {
                    _id,name,email,photo,phone,about,
                }
            );
        }
        else {
            res.status(400);
            throw new Error("User not found");
    }
});

//Get login status
const loginStatus = asyncHandler(async (req, res) =>{
    
    const token = req.cookies.token;
    if(!token) {
        return res.json(false);
    }
    
    //Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if(verified) {
        return res.json(true);
    }
    return res.json(false);
});

// Update User

const updateUser = asyncHandler (async (req, res) =>{
    const user = await User.findById(req.user._id);

    if(user) {
        const { name,email,photo,phone,about } = user;
        user.email = email,
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.about = req.body.about || about;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            photo: updatedUser.photo, 
            phone: updatedUser.phone, 
            about: updatedUser.about,
        })
    } 
    else {
        res.status(404)
        throw new Error("User not found")
    }   
});

//Changing Password
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const {oldPassword, password} = req.body;

    if(!user){
        res.status(404)
        throw new Error("User not found, please sign up");
    }

    if(!oldPassword || !password){
        res.status(400);
        throw new Error("Please add old and new password");
    }
    
    //Check if old password matches with password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword,user.password)

    //Save new password if matches
    if(user && passwordIsCorrect){
        user.password = password;
        await user.save()
        res.status(200).send("Password changed successfully");
    }

});

//Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})

    if(!user) {
        res.status(404)
        throw new Error("User does not exist")
    }

    //Delete token if it exist in DB
    let token = await Token.findOne({userId: user._id})
    if(token) {
        await token.deleteOne()
    }

    // Create Reset Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id
    console.log(resetToken);
    //Hash token before saving to DB
    const hashedToken =  crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    //Save token to DB. (another way)
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) // 30minutes

    }).save()

    //Construct Reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    // Reset Email
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password </p>
        <p>This reset link is valid for only 30 minutes.</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl} </a>
        <p>Regards </p>
        <p>Team</p>
    ` ;
    const subject = "Password Reset Request"
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER  
        
    try {
        await sendEmail(subject, message, send_to, sent_from)
        res.status(200).json( {success: true, message: "Reset Email Sent"})
    } 
    catch(error) {
        res.status(500)
        throw new Error("Email not sent, try again")
    }
    

});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;
  
    // Hash token, then compare to Token in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // fIND tOKEN in DB
    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });
  
    if (!userToken) {
      res.status(404);
      throw new Error("Invalid or Expired Token");
    }
  
    // Find user
    const user = await User.findOne({ _id: userToken.userId });
    user.password = password;
    await user.save();
    res.status(200).json({
      message: "Password Reset Successful, Please Login",
    });
  });

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword, 
    forgotPassword,
    resetPassword,
};