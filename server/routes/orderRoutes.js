const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ LOADED" : "❌ NOT LOADED");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "allampalliritikh@gmail.com",
    pass: "mbspwdknqertdgrm"  // no spaces
  }
});

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Send email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🧾 New Order Received",
      html: `
        <h3>🛍️ New Order from ${order.shipping.name}</h3>
        <p><strong>Address:</strong> ${order.shipping.address}</p>
        <p><strong>Contact:</strong> ${order.shipping.contact}</p>
        <p><strong>Email:</strong> ${order.shipping.email}</p>
        <hr>
        <h4>Order Items:</h4>
        <ul>
          ${order.items.map(item => `<li>${item.name} – ₹${item.price}</li>`).join("")}
        </ul>
        <p><strong>Total:</strong> ₹${order.total}</p>
        <p><strong>Placed At:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Order placed and email sent!" });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
});

module.exports = router;
