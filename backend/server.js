require("dotenv").config();
const express = require("express");
const scraperRoutes = require("./routes/scraperRoutes");

console.log("🚀 Server script is starting..."); // Debugging log

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

console.log("✅ Middleware applied");

app.use("/api/scraper", scraperRoutes);

console.log("✅ Routes registered");

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
