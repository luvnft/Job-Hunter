const puppeteer = require('puppeteer');

async function jobHunter(site) {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
        });
        const page = await browser.newPage();
        await page.goto(`http://www.${site}.com/`);
        await page.setViewport({
            width: 800,
            height: 600
        });
        // await browser.close()
    }
    catch {
        console.log("Oops")
    }
}
