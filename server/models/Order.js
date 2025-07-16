const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  shipping: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
  },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      image: String,
    },
  ],
  total: { type: Number, required: true },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
