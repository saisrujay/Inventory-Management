//importing the modules
const mongo = require('mongoose');
const bcrypt = require('bcryptjs');

const regex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

//creating the schema for the user object
const userschema = mongo.Schema(
    {
        name : {
            type : String,
            required : [true, "Name is required"]
        },
        email : {
            type : String,
            required : [true, "Email is required"],
            
            //regular expression for email
            match : [regex, "Enter a valid email address"],
            unique : true,
            trim : true,
        },
        password : {
            type : String,
            required : [true, "Password is required"],
            minLength : [7,"Must contain at least 7 characters"],
        },
        photo : {
            type : String,
            required : [true, "Please add a photo to your account"],
            default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
        },
        phone : {
            type : String,
            default : "+91"
        },
        bio : {
            type : String,
            maxLength : [300, "Must not contain more than 300 characters"],
            default : "ABOUT ME"
        }
    },
    {
        timestamps : true
    }
);

 //Encrypt the password before saving to the database
// This line registers a middleware function to be executed before the 
// save event of a user document. 
// The save event is triggered when a document is about to be saved to the database.

userschema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

    //Hash the password
    //  A salt is a random value used in 
    // password hashing to add complexity and make the hashed password more secure.
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    // This calls the next() function to proceed to the next middleware or the actual save operation after the password has been hashed and assigned
    next();
})
// Note: It's important to have the next() function called at the end of the middleware to allow the execution flow to continue.

const User = mongo.model('User',userschema);
module.exports = User;