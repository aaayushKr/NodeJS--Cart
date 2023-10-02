// Handle 404 errors by rendering the '404' page
exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found", // Set the page title for the 404 page
    path: "/404", // Set the path for the 404 page
    isAuthenticated: req.isLoggedIn, // Check if user is authenticated and pass the information to the view
  });
};
