const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');


const contactUs = asyncHandler(async (req, res) => {
    const {subject, message} = req.body;
    const user = await User.findById(req.user._id);

    if(!user) {
        res.status(400)
        throw new Error("User not found, signup");
    }

    //Validation
    if(!subject || !message){
        res.status(400)
        throw new Error("Add message and subject");
    }

    const send_to = process.env.EMAIL_USER;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email;
    try {
        await sendEmail(subject, message, send_to, sent_from)
        res.status(200).json( {success: true, message: "Email Sent"})
    } 
    catch(error) {
        res.status(500)
        throw new Error("Email not sent, try again")
    }
});

module.exports = {
    contactUs,
}

