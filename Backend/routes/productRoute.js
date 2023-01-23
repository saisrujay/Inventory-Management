const express = require('express');
const { createProduct } = require('../controllers/productController');
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const {upload} = require('../utils/fileUpload')

router.post("/",protect, upload.single("image"), createProduct);  

module.exports = router;