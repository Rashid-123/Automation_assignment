const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { solveCaptcha } = require("./captchaSolver")
const { axios } = require("axios");
async function startScraper(userInput) {
    console.log("🚀 Starting Puppeteer scraper...");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const pdfPaths = [];
    try {
        console.log("🔗 Navigating to website...");
        await page.goto("https://freesearchigrservice.maharashtra.gov.in/", { waitUntil: "networkidle2" });

        // Close the popup
        console.log("❌ Closing popup...");
        await page.waitForSelector(".btnclose.btn.btn-danger", { visible: true });
        await page.click(".btnclose.btn.btn-danger");

        // Click "Rest of Maharashtra"
        console.log("🖱 Clicking on 'Rest of Maharashtra'...");
        await page.waitForSelector("#btnOtherdistrictSearch", { visible: true });
        await page.click("#btnOtherdistrictSearch");

        await page.waitForSelector("#otherdistrictpropsearchPanel", { visible: true });

        // Fill in search inputs
        console.log("📝 Selecting search parameters...");
        await page.select("#ddlFromYear1", userInput.year);
        console.log("Year selected");

        console.log("📝 Fetching district options...");
        const options = await page.$$eval("#ddlDistrict1 option", opts =>
            opts.map(o => ({ value: o.value, text: o.textContent.trim() }))
        );
        // console.log("Available districts:", options);

        // Find the matching district
        const selectedOption = options.find(opt => opt.text === userInput.district);

        if (selectedOption) {
            console.log(`✅ Selecting district: ${userInput.district} (Value: ${selectedOption.value})`);
            await page.select("#ddlDistrict1", selectedOption.value);
        } else {
            console.error("❌ District not found! Check userInput.district.");
        }

        // Wait for the Tahsil dropdown to load
        console.log("⏳ Waiting for tahsil options to load...");
        await page.waitForFunction(() => {
            const tahsilOptions = document.querySelectorAll("#ddltahsil option");
            return tahsilOptions.length > 1; // Ensure new tahsil options are loaded
        }, { timeout: 5000 });

        // Fetch available tahsils
        console.log("📝 Fetching available tahsils...");
        const tahsils = await page.$$eval("#ddltahsil option", opts =>
            opts.map(o => ({ value: o.value, text: o.textContent.trim() }))
        );
        // console.log("Available tahsils:", tahsils);

        // Find matching tahsil
        const selectedTahsil = tahsils.find(t => t.text === userInput.tahsil);
        if (selectedTahsil) {
            console.log(`✅ Selecting Tahsil: ${userInput.tahsil} (Value: ${selectedTahsil.value})`);
            await page.select("#ddltahsil", selectedTahsil.value);
        } else {
            console.error("❌ Tahsil not found! Check userInput.tahsil.");
        }

        // Wait for the village dropdown to load
        console.log("⏳ Waiting for village options to load...");
        await page.waitForFunction(() => {
            const villageOptions = document.querySelectorAll("#ddlvillage option");
            return villageOptions.length > 1; // Ensure new tahsil options are loaded
        }, { timeout: 5000 });

        // Fetching the village options
        console.log("📝 Fetching available villages...");
        const villages = await page.$$eval("#ddlvillage option", opts =>
            opts.map(o => ({ value: o.value, text: o.textContent.trim() }))
        );

        // Selecting the village
        const selectedVillage = villages.find(v => v.text === userInput.village);
        if (selectedVillage) {
            console.log(`✅ Selecting Village: ${userInput.village} (Value: ${selectedVillage.value})`);
            await page.select("#ddlvillage", selectedVillage.value);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust time if needed
        } else {
            console.error("❌ Village not found! Check userInput.village.");
        }

        console.log(`✅ Entering Property No.: ${userInput.propertyNo}`);
        await page.type("#txtAttributeValue1", userInput.propertyNo, { delay: 500 });
        // ---------------------- solving the captcha -------------------

        console.log("🛑 Solving CAPTCHA...");
        await page.waitForSelector("#imgCaptcha_new", { visible: true });
        const captchaElement = await page.$("#imgCaptcha_new");
        const captchaBuffer = await captchaElement.screenshot();
        fs.writeFileSync("captcha.png", captchaBuffer);

        // Solve the CAPTCHA
        const captchaText = await solveCaptcha("captcha.png");
        if (!captchaText) throw new Error("❌ Failed to solve CAPTCHA");

        console.log(`✅ CAPTCHA solved: ${captchaText}`);

        await page.type("#txtImg1", captchaText, { delay: 200 });

        console.log("🔍 Clicking the search button...");
        await page.waitForSelector("#btnSearch_RestMaha", { visible: true });
        await page.click("#btnSearch_RestMaha");

        //--------------- Wait untill the error occures -----------------------

        await page.waitForSelector("#lblimg_new", { visible: true });

        console.log("🛑 Solving CAPTCHA...");
        await page.waitForSelector("#imgCaptcha_new", { visible: true });
        const captchaElement_2 = await page.$("#imgCaptcha_new");
        const captchaBuffer_2 = await captchaElement_2.screenshot();
        fs.writeFileSync("captcha.png", captchaBuffer_2);

        // Solve the CAPTCHA
        const captchaText_2 = await solveCaptcha("captcha.png");
        if (!captchaText_2) throw new Error("❌ Failed to solve CAPTCHA");

        console.log(`✅ CAPTCHA solved: ${captchaText_2}`);

        await page.type("#txtImg1", captchaText_2, { delay: 200 });

        console.log("🔍 Clicking the search button...");
        await page.waitForSelector("#btnSearch_RestMaha", { visible: true });
        await page.click("#btnSearch_RestMaha");

        // -------------------------- pdf download ------------------------------

        console.log("Waiting for Table...");
        await page.waitForSelector("#upRegistrationGrid", { visible: true, timeout: 60000 });

        console.log("Finding all 'IndexII' buttons...");
        let buttons = await page.$$("input[value='IndexII']");
        console.log(`Found ${buttons.length} buttons.`);

        for (let i = 0; i < buttons.length; i++) {
            buttons = await page.$$("input[value='IndexII']");
            if (buttons[i]) {
                const [newTarget] = await Promise.all([
                    browser.waitForTarget((target) => target.opener() === page.target()),
                    buttons[i].click(),
                ]);

                const newPage = await newTarget.page();
                if (!newPage) continue;

                await newPage.waitForSelector("body", { visible: true, timeout: 60000 });

                const pdfPath = path.join(__dirname, `../downloads/saved_page_${i + 1}.pdf`);
                await newPage.pdf({ path: pdfPath, format: "A4", printBackground: true });

                pdfPaths.push(pdfPath);
                await newPage.close();
            }
        }

        console.log("✅ All PDFs generated successfully.");

    } catch (error) {
        console.error("❌ Scraper error:", error);
    }
    return pdfPaths; // Return list of generated PDF paths


}

module.exports = { startScraper };




