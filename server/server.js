const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "✅ LOADED" : "❌ NOT LOADED");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/orders", orderRoutes);

// Serve static frontend files
const path = require("path");
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

// Fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
