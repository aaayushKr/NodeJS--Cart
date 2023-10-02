// Import required modules and packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

// Import error controller and user model
const errorController = require("./controllers/error");
const User = require("./models/user");

// Initialize CSRF protection
const csrfProtection = csrf();

// MongoDB connection URI
const MONGODB_URI =
  "mongodb+srv://Ayush:ayu23@cluster0.wbdk1aa.mongodb.net/shop";

// Create an Express application
const app = express();

// Create a session store using MongoDB
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// Configure view engine and views directory
app.set("view engine", "ejs");
app.set("views", "views");

// Import route handlers
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({extended: false}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Set up session middleware
app.use(
  session({
    secret: "my secret", // Secret for session data encryption
    resave: false,
    saveUninitialized: false,
    store: store, // Use MongoDB to store session data
  })
);

// Apply CSRF protection to prevent Cross-Site Request Forgery attacks
app.use(csrfProtection);

// Flash messages middleware
app.use(flash());

// Middleware to check if user is authenticated
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // If user is logged in, fetch user data from the database
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Middleware to set local variables for views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; // Variable to check user authentication status
  res.locals.csrfToken = req.csrfToken(); // CSRF token for forms
  next();
});

// Routes for admin, shop, and authentication
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 error handler
app.use(errorController.get404);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000); // Start the server on port 3000
  })
  .catch((err) => {
    console.log(err); // Log any errors that occur during MongoDB connection
  });
