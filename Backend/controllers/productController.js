const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const cloudinary = require('cloudinary').v2;

const createProduct = asyncHandler(
    async (req, res) => {
        const {id,name,sku,category,quantity,price,description } = req.body;

        if(!name || !category || !quantity || !price || !description) {
            res.status(404);
            throw new Error("All the fields are required");
        }

        //Image upload Manager
        let fileData = {};
        if(req.file) {       
            // Save image in cloudinary
            let uploadedFile;
            try {
                uploadedFile = await cloudinary.uploader.upload(
                    "img.png",
                    {
                        folder: "Inventory-app",
                        resource_type : "image"
                    }
                );
            } catch (error) {
                res.status(500);
                throw new Error("Image could not be uploaded");
            } 
            fileData = {
                fileName: req.file.originalname,
                filePath: uploadedFile.secure_url,
                fileType: req.file.mimetype,
                fileSize: `${req.file.size/1024} KB`,
            }
        }

        //Creating Product
        const product = await Product.create({
            user : req.user.id,
            name,
            sku,
            category,
            quantity,
            price,
            description,
            image: fileData
        });

        res.status(201).json(product);
    }
);

module.exports = {
    createProduct,
};