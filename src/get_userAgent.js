const { tv_login } = require("../crawlers/tv_account.js")
const { paper_trading_opener, csv_exporter } = require("../crawlers/tv_operations.js")
const { export_API } = require("../helpers/db.js")
const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js")
var logger = initial_logger()
const puppeteer = require('puppeteer-extra');
var userAgent = require('user-agents');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const sleep = ms => new Promise(r => setTimeout(r, ms));

const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

async function get_userAgent(){
    width = 1920;
    height = 1080;
    headless = "new"
    const browser = await puppeteer.launch(
        {
            headless,
            args: [`--window-size=${width},${height}`,
                    '--disable-setuid-sandbox', '--no-sandbox'        
                ] // new option
            // args:[
            //     '--start-maximized' // you can also use '--start-fullscreen'
            //  ]
            // executablePath: '/Applications/Chromium.app' 
        });
    const page = await browser.newPage();

    await page.goto("https://www.google.com", {waitUntil: 'domcontentloaded'});
    await page.waitForSelector('textarea')
    // await page.mouse.click(0, 100);
    const element = await page.$('textarea');
    await element.hover()
    await page.waitForTimeout(1000);
    await element.click()
    // await page.click('#searchform textarea',)
    // await page.sleep(3000)
    await page.keyboard.type("what is my user agent")
    await page.waitForTimeout(5000);
    await page.keyboard.press('Enter')
    await page.waitForSelector('block-component div > span')
    const text = await page.evaluate(() => {
        const span = document.querySelector('block-component div > span');
        if (span) {
            return span.parentElement.textContent;
        } else {
            return null;
        }
        });
    console.log(text.replace("Your user agent", "Your user agent:\n"))
    // await sleep(1000)
    // await page.screenshot({ path: './glitch.png' });
    await browser.close()
}

(async () => {
    await get_userAgent()
})()