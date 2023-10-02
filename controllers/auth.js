const bcrypt = require("bcryptjs"); // Import the bcryptjs library for password hashing

const User = require("../models/user"); // Import the User model

// Render the login page with error message if there is one
exports.getLogin = (req, res, next) => {
  let message = req.flash("error"); // Retrieve error message from flash messages (if any)
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

// Render the signup page with error message if there is one
exports.getSignup = (req, res, next) => {
  let message = req.flash("error"); // Retrieve error message from flash messages (if any)
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

// Handle user login
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({email: email}).then((user) => {
    if (!user) {
      // If user not found, set error message and redirect to login page
      req.flash("error", "Invalid credentials");
      return res.redirect("/login");
    }
    // Compare entered password with hashed password stored in the database
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          // If passwords match, set user session and redirect to home page
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        // If passwords do not match, set error message and redirect to login page
        req.flash("error", "Invalid credentials");
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  });
};

// Handle user signup
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Check if email already exists in the database
  User.findOne({email: email})
    .then((userDoc) => {
      if (userDoc) {
        // If email already exists, set error message and redirect to signup page
        req.flash("error", "Email already exists, please login");
        return res.redirect("/signup");
      }
      // Hash the password and create a new user with hashed password
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: {items: []},
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

// Handle user logout
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
