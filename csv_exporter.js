const puppeteer = require('puppeteer-extra');
var userAgent = require('user-agents');
const { initialize_logger, change_logger_label } = require("./helpers/initial.js")

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const sleep = ms => new Promise(r => setTimeout(r, ms));
var logger = initialize_logger("CSV_Exporter")

const email = "desab19561@loongwin.com";
const username = "BrearLaudf92cafd6a3d249968bcd38b6e0";
const password = "f92cafd6-a3d2-4996-8bcd-38b6e08dd0e2123!";
const value = 1000;

(async () => {
    logger = change_logger_label(logger, "Login")
      
    logger.info("Starting CSV Exporter")
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString())

    logger.info("Logging to the account")
    var [res, signed_in_page] = await tv_login(browser, email, username, password)
    if (res == 'Done'){
        logger.info("Login Successful!")
    }
    else{
        logger.error("Error in logging in")
        process.exit()
    }

    logger = change_logger_label(logger, "TV-Operations")
    logger.info("Starting TV Operations")
    res = await tv_functions(signed_in_page, value);
    if(res == 'Done'){
        logger.info(`The account for value: ${value} has been created successfully!`)
    }

})();

async function tv_login(browser, email, username, password){
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString())

    const url = "https://www.tradingview.com/"
    await page.goto(url, 
        { waitUntil: 'domcontentloaded' }
        )

    await page.waitForSelector('button[aria-label="Open user menu"]');
    // user_menu_btn = await page.$('button[aria-label="Open user menu"]');
    await page.click('button[aria-label="Open user menu"]')
    
    await page.waitForSelector("button[data-name=header-user-menu-sign-in]")
    sign_in_btn = await page.$("button[data-name=header-user-menu-sign-in]")
    await sign_in_btn.evaluate((el) => el.click());

    await page.waitForSelector('.js-show-email')
    email_btn = await page.$(".js-show-email");
    await email_btn.click()

    await page.waitForSelector('input[name=username]')
    await page.focus('input[name=username]')
    await page.keyboard.type(email)
    await page.focus('input[name=password]')
    await page.keyboard.type(password)

    await page.click("input[name=remember]")

    await page.click(".tv-button__loader")

    return ['Done', page]
}

async function tv_functions(page, value){
    // await sleep(10000)
    await page.waitForSelector("div[data-name=base]")
    await page.click("div[data-name=base]")
    
    await page.waitForSelector('button[aria-label="Open menu"]');
    // user_menu_btn = await page.$('button[aria-label="Open menu"]');
    await page.click('button[aria-label="Open menu"]')
    

    await page.waitForSelector("div[aria-label=Menu]")
    sign_in_btn = await page.$("div[aria-label=Menu] button")
    await sign_in_btn.evaluate((el) => el.click());

    await page.waitForSelector('a[data-main-menu-dropdown-track-id="Chart+"]')
    email_btn = await page.$('a[data-main-menu-dropdown-track-id="Chart+"]');
    await email_btn.click()

    await page.waitForSelector("div[data-name=order-panel-button]")    // order_panel_btn = await page.$('div[data-name=order-panel-button]');
    await sleep(1000)
    await page.click('div[data-name=order-panel-button]')

    console.log("Clicking on connect button")
    await page.waitForSelector("div[data-broker=Paper] button")

    connect_btn = await page.$("div[data-broker=Paper] button")
    await page.evaluate((el) => el.click(), connect_btn);

    await page.waitForSelector("button[name=broker-login-submit-button]")
    await page.click("button[name=broker-login-submit-button]")

    await page.waitForSelector("div.js-account-manager-header span")
    paper_trading_btn = await page.$("div.js-account-manager-header span")

    await page.evaluate((el) => el.click(), paper_trading_btn);

    await page.waitForSelector("div[data-name=menu-inner]>div>span")
    await page.click("div[data-name=menu-inner]>div>span")
    
    await sleep(4000)

    await page.focus('input[inputmode="numeric"]')
    console.log(`Value: ${value}`)
    await page.keyboard.type(value)

    await page.waitForSelector("button[name=submit]")
    await page.click("button[name=submit]")

    do{
        await page.click('div[data-name="order-panel-button"]')
        clicked = await page.$('button#Market')
        await sleep(200)
    }while(clicked == null)
    console.log("The button for order panel clicked!")

    await page.waitForSelector("button#Market")
    await page.click("button#Market")


    checkboxs = await page.$$("input[type=checkbox]")
    await checkboxs[0].evaluate((el) => el.click());
    await checkboxs[1].evaluate((el) => el.click());

    await page.click('div[data-name="order-panel"] > div > div > div > button')
    await sleep(10000);
    console.log('\x1b[32m%s\x1b[0m', "Order Sent") // green
    await sleep(500000);

    return ['Done', page]
    await sleep(500000);
}