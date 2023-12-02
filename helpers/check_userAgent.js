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

async function check_userAgent(){
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

    // await page.setUserAgent(userAgent.random().toString());
    // await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36")
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36")
    // await page.setViewport({
    //     // width: 1200,
    //     // height: 1080,
    //     // deviceScaleFactor: 1,
    //     // isLandScape: true
    // });
    await page.goto("https://i-know-you-faked-user-agent.glitch.me/new-window", {waitUntil: 'domcontentloaded'});
    
    await sleep(100000)
    await page.screenshot({ path: './glitch.png' });
    await browser.close()
    process.exit()
}

(async () => {
    await check_userAgent()
})()