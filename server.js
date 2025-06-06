const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL } = require('url'); // For URL validation

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/screenshots', express.static(screenshotsDir)); // Serve screenshots statically

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to take a screenshot
app.post('/api/screenshot', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Basic URL validation
    try {
        new URL(url); // This will throw an error if the URL is invalid
    } catch (error) {
        return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    let browser;
    try {
        console.log(`Attempting to screenshot: ${url}`);
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox', // Required for some environments (e.g. Docker)
                '--disable-setuid-sandbox'
            ],
            headless: "new" // Use the new headless mode
        });
        const page = await browser.newPage();

        // Set a reasonable viewport size
        await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

        // Navigate to the page
        // Increased timeout to 60 seconds for slower pages
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for a brief moment for lazy-loaded images or animations
        await new Promise(resolve => setTimeout(resolve, 1500));


        // Sanitize filename from URL
        const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = Date.now();
        const filename = `screenshot_${sanitizedUrl.slice(0,50)}_${timestamp}.png`;
        const filePath = path.join(screenshotsDir, filename);

        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`Screenshot saved to: ${filePath}`);

        res.json({
            message: 'Screenshot captured successfully!',
            screenshotUrl: `/screenshots/${filename}`, // URL to access the screenshot
            downloadUrl: `/api/download/${filename}` // URL for the download endpoint
        });

    } catch (error) {
        console.error('Error taking screenshot:', error);
        let userErrorMessage = 'Failed to capture screenshot. The website might be inaccessible, or the URL is incorrect.';
        if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
            userErrorMessage = 'Failed to capture screenshot. The website address could not be found.';
        } else if (error.message.includes('TimeoutError')) {
            userErrorMessage = 'Failed to capture screenshot. The website took too long to load.';
        }
        res.status(500).json({ error: userErrorMessage, details: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// API endpoint to download the screenshot
app.get('/api/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(screenshotsDir, filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                // Note: Can't send a new response if headers already sent
                // but good to log.
            }
            // Optionally, delete the file after download to save space
            // fs.unlinkSync(filePath);
        });
    } else {
        res.status(404).json({ error: 'File not found.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Screenshots will be saved in: ${screenshotsDir}`);
    console.log("Ensure the 'screenshots' directory exists in the project root.");
});