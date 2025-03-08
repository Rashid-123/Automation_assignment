const Tesseract = require("tesseract.js");

/**
 * Solves a CAPTCHA using OCR.
 * @param {string} imagePath - Path to the CAPTCHA image.
 * @returns {Promise<string>} - The extracted text.
 */
async function solveCaptcha(imagePath) {
  try {
    const { data } = await Tesseract.recognize(imagePath, "eng");
    return data.text.replace(/\s/g, "").trim(); // Remove spaces and extra characters
  } catch (error) {
    console.error("CAPTCHA solving error:", error);
    return null;
  }
}

module.exports = { solveCaptcha };
