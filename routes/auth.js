const express = require("express"); // Import the Express framework

const authController = require("../controllers/auth"); // Import functions from the authentication controller

const router = express.Router(); // Create an instance of Express Router

// Handle GET request to '/login': Render the login form
router.get("/login", authController.getLogin);

// Handle GET request to '/signup': Render the signup form
router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/logout", authController.postLogout);

module.exports = router; // Export the router to be used in other parts of the application
