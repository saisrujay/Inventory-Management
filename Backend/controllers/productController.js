const asyncHandler = require('express-async-handler');
const Product = require('../models/product');

const createProduct = asyncHandler(
    async (req, res) => {
        const {id,name,sku,category,quantity,price,description } = req.body;

        if(!name || !category || !quantity || !price || !description) {
            res.status(404);
            throw new Error("All the fields are required");
        }

        //Image upload

        //Creating Product
        const product = await Product.create({
            user : req.user.id,
            name,
            sku,
            category,
            quantity,
            price,
            description,
        });

        res.status(201).json(product);
    }
);

module.exports = {
    createProduct,
};