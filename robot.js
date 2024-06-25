const puppeteer = require('puppeteer');

async function jobHunter(site) {
    try {
        
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--ignore-certificate-errors', 
                '--disable-extensions', 
                '--disable-blink-features', 
                '--disable-blink-features=AutomationControlled'
            ],
            
        });
        const page = await browser.newPage();
        page.on('dialog', async dialog => {
            if (dialog.type() === 'beforeunload') {
                await dialog.dismiss();
            }
        });
        //Indeed
        if(site === 'indeed') {
            await page.goto(`http://www.${site}.com/jobs?q=Frontend+Developer&l=USA`);
            
        }
        //Ziprecruiter
        if(site === 'ziprecruiter') {
            await page.goto(`http://www.${site}.com/jobs-search?form=jobs-landing&search=Frontend+Developer&location=USA`);
            await page.click('button[type="button"]')
            // page.waitForSelector('#react-job-results-root > div > div.job_results_two_pane.overflow-x-hidden > div.pagination_container_two_pane > div.flex.w-full.flex-row.justify-between > div:nth-child(6) > a > p')
            // const total = await page.$eval('#react-job-results-root > div > div.job_results_two_pane.overflow-x-hidden > div.pagination_container_two_pane > div.flex.w-full.flex-row.justify-between > div:nth-child(6) > a > p', el => el.textContent)
            let i = 1;
            while(i != 5) {
                // await page.waitForSelector('.job_result_wrapper')
                let jobList = await page.$$(".job_result_wrapper")
                jobList.forEach((job) => {
                    page.waitForSelector(job)
                    job.click()
                })
                page.waitForSelector('[title="Next Page"]')
                await page.click('[title="Next Page"]')
                await page.waitForNavigation();
                i++;
            }
            await browser.close()

        }
    }
    catch {
        console.log("Oops")
    }
}
