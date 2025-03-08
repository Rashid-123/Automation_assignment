const { startScraper } = require("../utils/puppeteerHelper");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

/**
 * API Controller to trigger the scraping process.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function scrapeAndDownloadPDFs(req, res) {
  try {
    const userInput = req.body;

    if (!userInput.year || !userInput.district || !userInput.tahsil || !userInput.village || !userInput.propertyNo) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Start the scraper and get the PDF file paths
    const pdfFiles = await startScraper(userInput);
    if (pdfFiles.length === 0) return res.status(500).json({ error: "Failed to download PDFs" });

    // Create a zip file
    const zipFilePath = path.join(__dirname, "../downloads/pdfs.zip");
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      console.log(`✅ ZIP file created: ${zipFilePath} (${archive.pointer()} bytes)`);

      // Send ZIP file as response
      res.download(zipFilePath, "pdfs.zip", async (err) => {
        if (err) {
          console.error("❌ Error sending ZIP file:", err);
          return res.status(500).json({ error: "Failed to send ZIP file" });
        }

        console.log("✅ ZIP file sent successfully!");

        // Cleanup: Delete PDFs and ZIP file after sending
        try {
          pdfFiles.forEach((file) => fs.unlinkSync(file));
          fs.unlinkSync(zipFilePath);
          console.log("🗑️ Temporary files deleted.");
        } catch (cleanupError) {
          console.error("❌ Error deleting temporary files:", cleanupError);
        }
      });
    });

    archive.on("error", (err) => {
      console.error("❌ ZIP archive error:", err);
      res.status(500).json({ error: "Failed to create ZIP file" });
    });

    archive.pipe(output);
    pdfFiles.forEach((file) => archive.file(file, { name: path.basename(file) }));
    archive.finalize();
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

module.exports = { scrapeAndDownloadPDFs };
