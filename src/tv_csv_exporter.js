const { tv_login } = require("../crawlers/tv_account.js")
const { paper_trading_opener, csv_exporter } = require("../crawlers/tv_operations.js")
const { export_API } = require("../helpers/db.js")
const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js")
var logger = initial_logger()
const [email, password] = get_initial_args();
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    logger = change_logger_label(logger, "INITIAL")
    try{
        logger.info("Opening browser")
        var [page, browser] = await initial_crawler_config(headless='new', width=1000,height=850)
    }
    catch(err){
        logger.error(err.message)
        console.log(err)
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

    const string_paths = await csv_exporter(paper_trading_page, email)
    // await sleep(100000)

    console.log(string_paths)
    res = await export_API(email, string_paths)
    logger.info(`Response of sending to export_API: ${res}`)

    console.log("Done!")
    await browser.close()
})();


function get_initial_args(){
    const username = process.argv.slice(2)[0];
    const password = process.argv.slice(2)[1];

    if(username == undefined || password == undefined){
      console.log('\x1b[31m%s\x1b[0m',`Please enter email and password as an argument correctly\n`) //red
      process.exit();
    }
  
    return [username, password];
  }