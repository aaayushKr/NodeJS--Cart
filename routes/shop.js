const path = require("path"); // Import the 'path' module for working with file and directory paths

const express = require("express"); // Import the Express framework

const shopController = require("../controllers/shop"); // Import functions from the shop controller
const isAuth = require("../middleware/is-auth"); // Import the authentication middleware

const router = express.Router(); // Create an instance of Express Router

// Render the home page with a list of products
router.get("/", shopController.getIndex);

// Render a page with a list of all products
router.get("/products", shopController.getProducts);

//  Render details of a specific product
router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

//  Create a new order from the shopping cart
router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router; // Export the router to be used in other parts of the application
