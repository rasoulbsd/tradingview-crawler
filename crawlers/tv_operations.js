const { initial_logger, change_logger_label } = require("../helpers/initial.js")
var logger = initial_logger()

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
    async paper_trading_opener(page){
        logger = change_logger_label(logger, "PAPER-TRADING");
        logger.info("Open top left menu");
        // await sleep(50000)
        let attempts = 0;
        do{
            logger.warn("Open top left menu: Retrying...");
            if(attempts >= 2){
                if((await page.$('input[name="password"]')) != null){
                    logger.error("Probably the username or password is incorrect!");
                    process.exit()
                }
            }
            await page.waitForSelector('button[aria-label="Open menu"]');
            await page.click('button[aria-label="Open menu"]')

            opened_menu = await page.$("div[aria-label=Menu]")
            attempts += 1;
            if(attempts >= 15){
                logger.error("Timeout in openning menu")
                process.exit()
            }
            await sleep(3000)
        }while(opened_menu == null)
    
        logger.info("Click on the first item in the menu: Products")
        const products_btn = await page.$("div[aria-label=Menu] button")
        await products_btn.evaluate((el) => el.click());
    
        logger.info("Click on the first product: Supercharts")
        await page.waitForSelector('div[data-name="menu-inner"] a')
        supercharts_btn = await page.$('div[data-name="menu-inner"] a');
        await supercharts_btn.click()
    
        // logger.info("Clicking on order panel button")
        // await page.waitForSelector("[data-name=order-panel-button]")    // order_panel_btn = await page.$('div[data-name=order-panel-button]');
        // await sleep(4000)
        // await page.click('[data-name=order-panel-button]')
    
        // logger.info("Clicking on broker connect button")
        // await page.waitForSelector('div[data-name="order-panel"] button')
        // connect_btn = await page.$('div[data-name="order-panel"] button')
        // await connect_btn.evaluate((el) => el.click());

        logger.info("Clicking on first connect button")
        await page.waitForSelector('button[aria-label="Order Panel"]', { timeout:90000 })
        var connect_btn = await page.$('div[data-name="order-panel"] button')
        try_count = 0
        while(try_count <= 20 && connect_btn == null){
            try{
                await page.click('button[aria-label="Order Panel"]')
            }
            catch(err){
                logger.warn("Order panel button is not clicked!: Retrying...")
                await sleep(2000)
                continue
            }
            logger.warn("Clicking on first connect button: Retrying...")
            connect_btn = await page.$('div[data-name="order-panel"] button')
            try_count += 1
            await sleep(4000)
        }
        await connect_btn.click()

        logger.info("Clicking on papertrading connect button")
        await page.waitForSelector('div[data-broker="Paper"] button', { timeout:90000 })
        await page.click('div[data-broker="Paper"] button')

        logger.info("Clicking on broker login submit button")
        try_count = 0;
        do{
            connect_btn = await page.$("button[name=broker-login-submit-button]")
            await sleep(500)
            try_count += 1
            await page.click('div[data-broker="Paper"] button')
        }while(try_count <= 15 && connect_btn == null)

        if(connect_btn == null){
            logger.error("Error in clicking on second connect button in papertrading popup")
            process.exit();
        }
        else{
            await page.click("button[name=broker-login-submit-button]")
        }
    
        logger.info("Clicking on paper trading")
        await page.waitForSelector("div.js-account-manager-header span")
        paper_trading_btn = await page.$("div.js-account-manager-header span")
        await paper_trading_btn.evaluate((el) => el.click());
    
        logger.info("Successfully opened the paper trading menu.")
        return page;
    },

    async set_prop(page, value){
        logger = change_logger_label(logger, "SET-PROP")
        logger.info("Clicking on Reset Paper Trading account")
        await page.waitForSelector('div[data-name="menu-inner"]>div')
        let export_btn = await page.$$('div[data-name="menu-inner"]>div')
        await export_btn[0].click()

        logger.info(`Select input field in the popup modal and set value: ${value}`)
        await page.waitForSelector('div[data-name="trading-paper-reset"] input')
        await page.focus('div[data-name="trading-paper-reset"] input')
        await page.keyboard.type(value.toString())

        logger.info("Clicking on reset button")
        await page.click('button[name="submit"]')

        return page;
    },

    async create_initial_transaction(page){
        logger = change_logger_label(logger, "CREATE_TRANS")

        logger.info("Clicking on market button")
        var market_brn = await page.$("#Market")
        try_count = 0;
        while(try_count <= 20 && market_brn == null){
            await page.click('button[aria-label="Order Panel"]')
            await sleep(3000)
            logger.warn("Clicking on market button: Retrying...")
            market_brn = await page.$("#Market")
            try_count += 1
        }
        await page.click("#Market")

        logger.info("Clicking on unit")
        await page.waitForSelector('div[data-name="order-panel"] input[inputmode="numeric"]')
        await page.focus('div[data-name="order-panel"] input[inputmode="numeric"]')

        // logger.info("Check on two checkboxes")
        // await page.waitForSelector('input[type="checkbox"]')
        // var attempts = 0;
        // do{
        //     checkboxes = await page.$$('input[type="checkbox"]')
        //     try{
        //         await checkboxes[0].click()
        //         await checkboxes[1].click()
        //         var error = false;
        //     }
        //     catch{
        //         logger.warn("Check on two checkboxes: Retrying...");
        //         await sleep(3000);
        //         error = true;
        //     }
        //     attempts += 1
        // }while(attempts <= 10 && error==true)
        // if(attempts >= 10)
        //     await sleep(1000000)

        logger.info("Click on Buy button")
        await page.waitForSelector('div[data-name="order-panel"] button')
        order_panel_btns = await page.$$('div[data-name="order-panel"] button')
        await order_panel_btns[4].click("button[name=submit]")

        logger.info("Closing transaction: click on cross")
        await page.waitForSelector('div[title="Close"]')
        cross_btn = await page.$('div[title="Close"]')

        try{
            articles = await page.waitForSelector('article>button', {setTimeout:5000})
            if(articles != 0){
                logger.error('Transaction is probably one created!')
                return 'Created'
                // await sleep(2000000)
                // process.exit()
            }
            
        }
        catch(err){
            logger.info("Click on close position")
        }
        await page.waitForSelector('button[name="submit"]') 
        await page.click('button[name="submit"]')

        // do{

        //     await cross_btn.click()
        //     var submit_btn = await page.$('button[name="submit"]')
        //     if(submit_btn != null)
        //         break
        //     await sleep(1000)
        //     logger.warn("Click on close position: Retrying...")
        //     try_count += 1
        // }while(try_count <= 10 && submit_btn == null)


        return 'Created'
    },

    async csv_exporter(page, email){
        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
                            behavior: 'allow',
                            downloadPath: `./downloads/${email.split('@')[0]}-${new Date()}`,
                        })
        // await page._client.send('Page.setDownloadBehavior', {
        //     behavior: 'allow',
        //     downloadPath: "." 
        // });
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
        // await https.get(imgUrl, res => {
        //     const stream = fs.createWriteStream('somepic.png');
        //     res.pipe(stream);
        //     stream.on('finish', () => {
        //         stream.close();
        //     })
        // })
        // await page.on('request', req => {
        //     if (req.url() === urlFile) {
        //         const file = fs.createWriteStream('./file.pdf');
        //         https.get(req.url(), response => response.pipe(file));
        //     }
        // });
    }
}
