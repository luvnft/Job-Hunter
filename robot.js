const puppeteer = require('puppeteer');
const fs = require('fs');
const yaml = require('js-yaml');
const { WebhookClient, EmbedBuilder } = require('discord.js');

let positions = [];
let locations = [];
let blacklistCompanies = [];
let blackListTitles = [];
let keywords = [];
let ziprecruiterwebhook = ""


async function jobHunter(site) {
    try {
        const yamlData = yaml.load(fs.readFileSync('config.yaml', 'utf8'))
        positions = yamlData.positions
        locations = yamlData.locations
        blacklistCompanies = yamlData.blacklistCompanies
        blackListTitles = yamlData.blackListTitles
        keywords = yamlData.keywords
        ziprecruiterwebhook = yamlData.ziprecruiterWebhook
    } catch (error) {
        console.error(error);
    }
    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/local/bin/chromium',
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
                await page.waitForSelector('.job_result_wrapper')
                let jobList = await page.$$(".job_result_wrapper")
                for(let job of jobList) {
                    await page.waitForSelector('ul.list-outside.list-disc.pl-24')
                    let ul = await page.$('ul.list-outside.list-disc.pl-24');
                    
                    let totalSpan = await page.evaluate(ul => {
                        let liElem = ul.querySelectorAll('li');
                        let str = '';

                        liElem.forEach(li => {
                            let span = li.querySelector('span');
                            if (span) {
                                str += span.textContent.trim() + ' ';
                            }
                        })
                        return str.trim();
                    }, ul)

                    let threshold = 0;
                    let matches = '';
                    for(const key of keywords) {
                        if(totalSpan.toLowerCase().includes(key.toLowerCase())) {
                            threshold++;
                            matches += key + " ";
                        }
                        if(threshold >= 3) {
                            let title = await page.$eval('h1.font-bold.text-black.text-header-lg', el => el.textContent)
                            let currentURL = page.url();
                            let company_name = '';
                            let job_location = '';

                            const webhookClient = new WebhookClient({ url: ziprecruiterwebhook });

                            const embed = new EmbedBuilder()
                                .setTitle(`${title}`)
                                .setURL(currentURL)
                                .setFooter({text: `Matched keywords: ${matches}` })
                                .setColor('#00FF00');

                            // Send the embed
                            webhookClient.send({
                                content: '<@391055696713613315>',
	                            username: 'Job Alert',
                                embeds: [embed],
                            });

                            break;
                        }
                    }
                    await job.click()

                    await new Promise(resolve => setTimeout(resolve, 100));
                }
             
                await page.waitForSelector('[title="Next Page"]')
                await page.click('[title="Next Page"]')
                await page.waitForNavigation();
            
            await browser.close()

        }
    }
    catch(err) {
        console.log(err)
    }
}
