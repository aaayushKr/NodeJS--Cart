module.exports = (req, res, next) => {
  // Check if the user is not logged in (session variable 'isLoggedIn' is not set)
  if (!req.session.isLoggedIn) {
    // If not logged in, redirect the user to the login page
    return res.redirect("/login");
  }
  // If the user is logged in, call the next middleware function in the stack
  next();
};
