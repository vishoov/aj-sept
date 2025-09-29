const { 
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    searchProduct
} = require('../controller/product.controller');

const router = require('express').Router();

// Create product
router.post('/createproduct', createProduct);

// Fetch Product
router.get('/products', getProducts);

// Update Product
router.put('/updateproduct/:id', updateProduct);

// Delete Product
router.delete('/deleteproduct/:id', deleteProduct);

// Search Product
router.get('/searchproduct', searchProduct);

module.exports = router;
