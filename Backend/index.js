const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

// MongoDB Schema
const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: String,
  sold: Boolean,
  category: String,
});

const Product = mongoose.model("Product", ProductSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/products", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Initialize Database with Seed Data
app.get("/api/initialize", async (req, res) => {
  try {
    const { data } = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    await Product.deleteMany(); // Clear old data
    await Product.insertMany(data); // Insert new data
    res.send("Database initialized with seed data.");
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).send("Error initializing database");
  }
});

// List Transactions with Search and Pagination
app.get("/api/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;
  const skip = (page - 1) * perPage;

  const filters = {};
  if (month) filters.dateOfSale = { $regex: `-${month}-`, $options: "i" };
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    const searchPrice = parseFloat(search);
    if (!isNaN(searchPrice)) filters.$or.push({ price: searchPrice });
  }

  try {
    const transactions = await Product.find(filters).skip(skip).limit(Number(perPage));
    const total = await Product.countDocuments(filters);
    res.json({ transactions, total });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Statistics API
app.get("/api/statistics", async (req, res) => {
  const { month } = req.query;
  const filters = month ? { dateOfSale: { $regex: `-${month}-`, $options: "i" } } : {};

  try {
    const totalSales = await Product.aggregate([
      { $match: filters },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const soldItems = await Product.countDocuments({ ...filters, sold: true });
    const unsoldItems = await Product.countDocuments({ ...filters, sold: false });

    res.json({
      totalSales: totalSales[0]?.total || 0,
      soldItems,
      unsoldItems,
    });
  } catch (error) {
    console.error("Error in statistics API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Bar Chart API
app.get("/api/bar-chart", async (req, res) => {
  const { month } = req.query;
  const filters = month ? { dateOfSale: { $regex: `-${month}-`, $options: "i" } } : {};

  const ranges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  try {
    const data = await Promise.all(
      ranges.map(async (range) => {
        const count = await Product.countDocuments({
          ...filters,
          price: { $gte: range.min, $lte: range.max === Infinity ? undefined : range.max },
        });
        return { range: `${range.min}-${range.max === Infinity ? "above" : range.max}`, count };
      })
    );

    res.json(data);
  } catch (error) {
    console.error("Error in bar chart API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Pie Chart API
app.get("/api/pie-chart", async (req, res) => {
  const { month } = req.query;
  const filters = month ? { dateOfSale: { $regex: `-${month}-`, $options: "i" } } : {};

  try {
    const categories = await Product.aggregate([
      { $match: filters },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(categories.map((cat) => ({ category: cat._id, count: cat.count })));
  } catch (error) {
    console.error("Error in pie chart API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Combined Data API
app.get("/api/combined", async (req, res) => {
  const { month } = req.query;

  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      (async () => {
        const stats = await Product.aggregate([
          { $match: month ? { dateOfSale: { $regex: `-${month}-`, $options: "i" } } : {} },
          { $group: { _id: null, total: { $sum: "$price" } } },
        ]);
        return {
          totalSales: stats[0]?.total || 0,
          soldItems: await Product.countDocuments({ sold: true }),
          unsoldItems: await Product.countDocuments({ sold: false }),
        };
      })(),
      Product.aggregate([{ $group: { _id: "$price", count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);

    res.json({ statistics, barChart, pieChart });
  } catch (error) {
    console.error("Error in combined API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
