const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Enable CORS for the frontend origin
app.use(cors({
  origin: "http://127.0.0.1:5500", // Allow only the frontend origin
  methods: ["GET"], // Allow only GET requests
}));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB Connection Error:"));
db.once("open", () => console.log("✅ MongoDB Connected Successfully"));

// Define Schema
const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
  },
  { collection: "Products" }
);

const Product = mongoose.model("Product", productSchema);

// API Route to Fetch Products
app.get("/products", async (req, res) => {
  try {
    console.log("Fetching products..."); // Log to verify the route is hit
    const products = await Product.find();
    console.log("Products found:", products); // Log the fetched products
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