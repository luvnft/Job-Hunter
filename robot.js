import puppeteer from "puppeteer";

async function scraper(input) {
    if(input == 'Indeed') {
        site = "https://www.indeed.com/"
        alert(site)
    }
    else {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        
        await page.goto(site);
        await page.setViewport({
            width: 1200,
            height: 750
        })
   }
}
