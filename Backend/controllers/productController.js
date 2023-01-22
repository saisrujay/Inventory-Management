const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(
    async (req, res) => {
        res.send("Product is created");
    }
);

module.exports = {
    createProduct,
};