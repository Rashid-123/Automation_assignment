const express = require("express");
const { scrapeAndDownloadPDFs } = require("../controllers/scraperController");

const router = express.Router();

// Route to trigger the scraping process
router.post("/download", scrapeAndDownloadPDFs);

module.exports = router;
