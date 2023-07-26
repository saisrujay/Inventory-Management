const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    userId: {
        // mongoose.Schema.Types.ObjectId is a data type provided by Mongoose for representing unique identifiers (IDs) in MongoDB. 
        // It is a specific type of data that is used to store the unique identifier assigned to each document in a collection.
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // The ref: 'user' option specifies that this field references the user model.
        ref: 'user'
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

const Token = mongoose.model("Token",tokenSchema)
module.exports = Token