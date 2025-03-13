const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Connect to MongoDB (without .env file)
mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB Connection Error:"));
db.once("open", () => console.log("✅ MongoDB Connected Successfully"));

// Define Schema with Correct Collection Name
const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
  },
  { collection: "ecommerce" } // Collection name MUST match exactly
);

const Product = mongoose.model("Product", productSchema);

// API Route to Fetch Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in database" });
    }
    res.json(products);
  } catch (error) {
    console.error("⚠️ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
