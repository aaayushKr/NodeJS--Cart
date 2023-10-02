const Product = require("../models/product"); // Import the Product model
const Order = require("../models/order"); // Import the Order model

// Render the product list page
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Render the product detail page for a specific product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// Render the home page (index) with a list of products
exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products, // Pass the retrieved products to the view
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Render the cart page with the user's cart items
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// Handle adding a product to the user's cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product); // Add the product to the user's cart
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart"); // Redirect to the cart page after adding the product to the cart
    });
};

// Handle removing a product from the user's cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId) // Remove the product from the user's cart
    .then((result) => {
      res.redirect("/cart"); // Redirect to the cart page after removing the product from the cart
    })
    .catch((err) => console.log(err));
};

// Handle placing an order
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {quantity: i.quantity, product: {...i.productId._doc}};
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save(); // Save the order to the database
    })
    .then((result) => {
      return req.user.clearCart(); // Clear the user's cart after placing the order
    })
    .then(() => {
      res.redirect("/orders"); // Redirect to the orders page after placing the order
    })
    .catch((err) => console.log(err));
};

// Render the user's orders
exports.getOrders = (req, res, next) => {
  Order.find({"user.userId": req.user._id}) // Find orders belonging to the current user
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
