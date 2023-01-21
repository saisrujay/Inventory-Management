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
        about : {
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
userschema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
})

const User = mongo.model('User',userschema);
module.exports = User;