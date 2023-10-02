const Product = require("../models/product"); // Import the Product model

// Render the add product page
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn, // Check if user is authenticated
  });
};

// Handle the addition of a new product
exports.postAddProduct = (req, res, next) => {
  // Extract product information from the request body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Create a new Product instance with the extracted data
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user, // Store the user ID who created the product
  });

  // Save the product to the database
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Render the edit product page with product details
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  // Find the product by ID and render the edit product page with product details
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn, // Check if user is authenticated
      });
    })
    .catch((err) => console.log(err));
};

// Handle updating product details
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // Find the product by ID and update its details
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products"); // Redirect to the products page after updating the product
    })
    .catch((err) => console.log(err));
};

// Render the products page with a list of products
exports.getProducts = (req, res, next) => {
  // Retrieve all products from the database
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// Handle the deletion of a product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  // Find the product by ID and remove it from the database
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
