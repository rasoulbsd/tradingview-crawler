const { tv_login } = require("../crawlers/tv_account.js");
const { set_prop, paper_trading_opener, create_initial_transaction } = require("../crawlers/tv_operations.js");
const { initProp_API } = require("../helpers/db.js")

const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js");
var logger = initial_logger();
const sleep = ms => new Promise(r => setTimeout(r, ms));

const [email, password, value] = get_initial_args();


(async () => {
    logger = change_logger_label(logger, "TV_SET_PROP");
    logger.info("Starting")

    logger = change_logger_label(logger, "TV_INITIAL_CRAWLER")
    try{
        logger.info("Opening browser")
        var [page, browser] = await initial_crawler_config(headless=false, width=1000,height=850)
    }
    catch(err){
        logger.error(err.message)
        process.exit(3)
    }
    logger = change_logger_label(logger, "TV_SET_PROP");

    // email = "Bernadina_Vins_9e785@sarmayedigital.com";
    // password = "9e78529c-ad28-4ac4-a5bb-9acdb72923f0123!";

    page = await tv_login(page, email, password);

    page = await paper_trading_opener(page);

    res = await set_prop(page, value)
    logger.info(`Response of setting prop: ${res}`)

    res = await create_initial_transaction(page)
    logger.info(`Response of setting prop: ${res}`)

    logger.info(`Sending to DB`)
    res = await initProp_API(email, value);
    logger.info(`Response of setting prop: ${res}`)

    console.log("Done")
    await browser.close()
    // ToDo: Sending to DB
})();

function get_initial_args(){
    const username = process.argv.slice(2)[0];
    const password = process.argv.slice(2)[1];
    const value = process.argv.slice(2)[2];

    if(username == undefined || password == undefined){
      console.log('\x1b[31m%s\x1b[0m',`Please enter email and password as an argument correctly\n`) //red
      process.exit();
    }

    if(value == undefined){
        console.log('\x1b[31m%s\x1b[0m',`Please enter value\n`) //red
        process.exit();
    }
  
    return [username, password, value];
  }