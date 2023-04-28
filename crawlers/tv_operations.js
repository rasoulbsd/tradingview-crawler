const { initial_logger, change_logger_label } = require("../helpers/initial.js")
var logger = initial_logger()

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
    async paper_trading_opener(page){
        logger = change_logger_label(logger, "PaperTrading")
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
    },

    async set_prop(page, value){
        logger = change_logger_label(logger, "PaperTrading")
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
    
    },
    
    async csv_exporter(page){
        logger = change_logger_label(logger, "CSV-Export")
        logger.info("Clicking on Exporting data")
        await page.waitForSelector('div[data-name="menu-inner"]>div')
        let export_btn = await page.$$('div[data-name="menu-inner"]>div')
        await export_btn[4].click()
    
        logger.info("Selecting History")
        await page.waitForSelector('span[data-role="listbox"]')
        await page.click('span[data-role="listbox"]')
        await page.waitForSelector('div#id_item_History')
        await page.click('div#id_item_History')
    
        logger.info("Clicking on export submit button")
        await page.click('button[name="submit"]')
    
    
    
    }
}
