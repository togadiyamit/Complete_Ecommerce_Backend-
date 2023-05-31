const express = require('express');
const router = express.Router();
const { addItems, upload, getItems, searchItems, addToCart, checkout, submitReview, searchItemsbyId, getOrders } = require("../controller/itemController");
const validateToken = require("../middlewear/validTokenHandler");

// Apply token validation middleware to all routes
router.use(validateToken);

// Home route
router.get('/home', getItems);

// Search item by ID route
router.get('id/:id', searchItemsbyId);

// Add item route
router.post('/add', upload.single('item_image'), addItems);

// Submit review route
router.post('/review', submitReview);

// Search items route
router.get('/search/:query', searchItems);

// Add to cart route
router.post('/addtocart', addToCart);

// Checkout route
router.post('/checkout', checkout);

// Orders route
router.get('/orders', getOrders);

module.exports = router;
