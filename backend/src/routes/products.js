const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

// Create product
router.post("/", async (req, res) => {
  try {
    const { name, price, categories = [] } = req.body;
    if (!name || price == null)
      return res.status(400).json({ error: "name and price required" });

    // validate category ids optionally
    if (categories.length) {
      const found = await Category.find({ _id: { $in: categories } });
      if (found.length !== categories.length) {
        return res
          .status(400)
          .json({ error: "One or more category ids are invalid" });
      }
    }

    const product = new Product({ name, price, categories });
    await product.save();
    await product.populate("categories", "name"); // populate for response
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products with populated categories (only names)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("categories", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categories",
      "name"
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { name, price, categories } = req.body;
    if (categories) {
      const found = await Category.find({ _id: { $in: categories } });
      if (found.length !== categories.length)
        return res.status(400).json({ error: "Invalid category id" });
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, categories },
      { new: true }
    ).populate("categories", "name");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
