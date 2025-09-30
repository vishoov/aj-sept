const router = require("express").Router();

const { placeOrder, cancelOrder, trackOrder } = require("../controller/order.controller")


// Place Order
router.post("/placeorder", placeOrder)
// Cancel Order
router.put("/cancelOrder", cancelOrder)

// Track
router.get("/trackorder", trackOrder)

module.exports = router;
