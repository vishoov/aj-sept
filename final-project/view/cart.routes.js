const router = require('express').Router();
const {
    addToCart,
    deleteFromCart,
    fetchCart
} = require("../controller/cart.controller");

// Add to cart
router.post("/addtocart", addToCart)

// Delete From Cart
router.delete("/deletefromcart", deleteFromCart)

// Fetch Cart
router.get("/fetchcart", fetchCart);

module.exports = router;

