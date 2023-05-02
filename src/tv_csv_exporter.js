const { tv_login } = require("../crawlers/tv_account.js")
const { paper_trading_opener, csv_exporter } = require("../crawlers/tv_operations.js")

const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js")
var logger = initial_logger()

// ToDo: Read from dotenv and DB
const email = "desab19561@loongwin.com";
const password = "f92cafd6-a3d2-4996-8bcd-38b6e08dd0e2123!";

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
        await page.goto(url, { waitUntil: 'domcontentloaded' })
    }
    catch(err){
        logger.error(err.message)
        process.exit()
    }

    let signed_in_page;
    try{
        signed_in_page = await tv_login(page, email, password)
        logger.info("Login Successful!")
    }
    catch(err){
        logger.error(`Error in logging in: ${err.message}`)
        process.exit()
    }

    let paper_trading_page = await paper_trading_opener(signed_in_page);

    await csv_exporter(paper_trading_page)
})();