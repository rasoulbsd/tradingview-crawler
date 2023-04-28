const sleep = ms => new Promise(r => setTimeout(r, ms));

const { initial_crawler_config, initial_logger, change_logger_label } = require("./helpers/initial.js")
var logger = initial_logger()

const email = "desab19561@loongwin.com";
const password = "f92cafd6-a3d2-4996-8bcd-38b6e08dd0e2123!";
const value = 1000;

(async () => {
    logger = change_logger_label(logger, "INITIAL")
    var page;
    try{
        logger.info("Opening browser")
        page = await initial_crawler_config()
    }
    catch(err){
        logger.error(err.message)
        process.exit(3)
    }

    logger = change_logger_label(logger, "URL")
    const url = "https://www.tradingview.com/"
    logger.info(`Opening tv url: ${url}`)
    try{
        await page.goto(url, 
            { waitUntil: 'domcontentloaded' }
        )
    }
    catch(err){
        logger.error(err.message)
        process.exit()
    }

    logger = change_logger_label(logger, "Login")
    var [res, signed_in_page] = await tv_login(page, email, password)
    if (res == 'Done'){
        logger.info("Login Successful!")
    }
    else{
        logger.error("Error in logging in")
        process.exit()
    }

    logger = change_logger_label(logger, "PaperTrading")
    let paper_trading_page = await paper_trading_opener(signed_in_page,);

    res = await set_prop(paper_trading_page, value)
})();

async function tv_login(page, email, password){
    logger.info("Open user menu")
    await page.waitForSelector('button[aria-label="Open user menu"]');
    // user_menu_btn = await page.$('button[aria-label="Open user menu"]');
    await page.click('button[aria-label="Open user menu"]')

    logger.info("Click on sign in button")
    await page.waitForSelector("button[data-name=header-user-menu-sign-in]")
    sign_in_btn = await page.$("button[data-name=header-user-menu-sign-in]")
    await sign_in_btn.evaluate((el) => el.click());

    logger.info("Click on email button")
    await page.waitForSelector('.js-show-email')
    email_btn = await page.$(".js-show-email");
    await email_btn.click()

    logger.info("Typing email and password")
    await page.waitForSelector('input[name=username]')
    await page.focus('input[name=username]')
    await page.keyboard.type(email)
    await page.focus('input[name=password]')
    await page.keyboard.type(password)

    logger.info("Click on remember me checkbox: disable it")
    await page.click("input[name=remember]")

    logger.info("Submiting login form")
    await page.click(".tv-button__loader")

    return ['Done', page]
}

async function paper_trading_opener(page){
    logger.info("Open top left menu")
    let attempts = 0;
    do{
        await page.waitForSelector('button[aria-label="Open menu"]');
        await page.click('button[aria-label="Open menu"]')

        opened_menu = await page.$("div[aria-label=Menu]")
        attempts += 1;
        if(attempts >= 58){
            logger.error("Timeout in openning menu")
            process.exit()
        }
        await sleep(500)
    }while(opened_menu == null)

    logger.info("Click on the first item in the menu: Products")
    const products_btn = await page.$("div[aria-label=Menu] button")
    await products_btn.evaluate((el) => el.click());

    logger.info("Click on the first product: Supercharts")
    await page.waitForSelector('div[data-name="menu-inner"] a')
    supercharts_btn = await page.$('div[data-name="menu-inner"] a');
    await supercharts_btn.click()

    logger.info("Clicking on order panel button")
    await page.waitForSelector("[data-name=order-panel-button]")    // order_panel_btn = await page.$('div[data-name=order-panel-button]');
    await sleep(4000)
    await page.click('[data-name=order-panel-button]')

    logger.info("Clicking on broker connect button")
    await page.waitForSelector("div[data-broker=Paper] button")
    connect_btn = await page.$("div[data-broker=Paper] button")
    await connect_btn.evaluate((el) => el.click());

    logger.info("Clicking on broker login submit button")
    await page.waitForSelector("button[name=broker-login-submit-button]")
    await page.click("button[name=broker-login-submit-button]")

    logger.info("Clicking on paper trading")
    await page.waitForSelector("div.js-account-manager-header span")
    paper_trading_btn = await page.$("div.js-account-manager-header span")
    await paper_trading_btn.evaluate((el) => el.click());

    logger.info("Successfully opened to paper trading menu.")
    return page;
}

async function set_prop(page, value){
    logger.info("Cl")
    await page.waitForSelector("div[data-name=menu-inner]>div>span")
    await page.click("div[data-name=menu-inner]>div>span")
    
    // await sleep(4000)
    await page.waitForSelector('input[inputmode="numeric"]')
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

async function csv_exporter(page){

}