const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
// app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(cors()); // allow all origins
// routes
const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/products");

app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);

// error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://192.168.1.3:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Mongo connect error", err);
  });
