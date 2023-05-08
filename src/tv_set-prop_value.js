const { create_email } = require("../helpers/cpanel.js");
const { tv_create_account, tv_login } = require("../crawlers/tv_account.js");
const { set_prop, paper_trading_opener } = require("../crawlers/tv_operations.js");
const { cpanel_verfiy_email } = require("../helpers/cpanel_verfiy_email.js")

const { initial_crawler_config, initial_logger, change_logger_label, get_initial_args } = require("../helpers/initial.js");
var logger = initial_logger();
const sleep = ms => new Promise(r => setTimeout(r, ms));

// const value = get_initial_args();


(async () => {
    logger = change_logger_label(logger, "TV_SET_PROP");
    logger.info("Starting")

    logger = change_logger_label(logger, "TV_INITIAL_CRAWLER")
    try{
        logger.info("Opening browser")
        var [page, browser] = await initial_crawler_config()
    }
    catch(err){
        logger.error(err.message)
        process.exit(3)
    }

    email = "Bernadina_Vins_9e785@sarmayedigital.com";
    password = "9e78529c-ad28-4ac4-a5bb-9acdb72923f0123!";

    page = await tv_login(page, email, password);

    page = await paper_trading_opener(page);

    res = await set_prop(page, value=5000)
    logger.info(`Response of setting prop: ${res}`)

    // ToDo: Sending to DB
})();