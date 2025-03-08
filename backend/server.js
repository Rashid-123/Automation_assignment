require("dotenv").config();
const express = require("express");
const cors = require("cors");
const scraperRoutes = require("./routes/scraperRoutes");

console.log("🚀 Server script is starting...");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ✅ Apply CORS Middleware
app.use(
  cors({
    origin: FRONTEND_URL, // Allow requests from the frontend
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

console.log("✅ Middleware applied");

app.use("/api/scraper", scraperRoutes);

console.log("✅ Routes registered");

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
