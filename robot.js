const puppeteer = require('puppeteer');

async function test() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        const site = "https://www.indeed.com/"; // Replace with your desired site
        
        await page.goto(site);
        await page.setViewport({
            width: 800,
            height: 600
        });
        await browser.close()
    }
    catch {
        console.log("Oops")
    }
}
