const path = require("path"); // Import the 'path' module for working with file and directory paths

const express = require("express"); // Import the Express framework

const adminController = require("../controllers/admin"); // Import the admin controller functions
const isAuth = require("../middleware/is-auth"); // Import the authentication middleware

const router = express.Router(); // Create an Express Router instance

// Handle GET request to '/admin/add-product'
router.get("/add-product", isAuth, adminController.getAddProduct);

// Handle GET request to '/admin/products'
router.get("/products", isAuth, adminController.getProducts);

// Handle POST request to '/admin/add-product'
router.post("/add-product", isAuth, adminController.postAddProduct);

// Handle GET request to '/admin/edit-product/:productId'
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// Handle POST request to '/admin/edit-product'
router.post("/edit-product", isAuth, adminController.postEditProduct);

// Handle POST request to '/admin/delete-product'
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router; // Export the router to be used in other parts of the application
