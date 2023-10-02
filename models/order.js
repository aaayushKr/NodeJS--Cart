const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Access the Schema class from Mongoose

// Define the structure of the 'orders' collection in the MongoDB database using Mongoose Schema
const orderSchema = new Schema({
  products: [
    {
      product: {type: Object, required: true}, // Embedded object containing product details
      quantity: {type: Number, required: true}, // Quantity of the product in the order
    },
  ],
  user: {
    email: {
      type: String,
      required: true, // Email of the user who placed the order
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true, // Unique ID referencing the user who placed the order
      ref: "User", // Reference to the 'User' model in the database
    },
  },
});

module.exports = mongoose.model("Order", orderSchema); // Create and export the 'Order' model based on the schema
