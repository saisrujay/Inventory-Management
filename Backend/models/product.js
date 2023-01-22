const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        name : {
            type : String,
            required : [true,"Name is required"],
            trim : true 
        },
        sku : {
            type : String,
            required : true,
            default : "SKU",
            trim : true 
        },
        category : {
            type : String,
            required : [true,"Category is required"],
            trim : true 
        },
        quantity : {
            type : String,
            required : [true,"Quantity is required"],
            trim : true 
        },
        description : {
            type : String,
            required : [true,"Description is required"],
            trim : true 
        },
        image : {
            type : object,
            default : {}
        }
    }, 
    {
        timestamps : true,
    }
);

const Product = mongoose.model("Product",productSchema)
module.exports = Product;