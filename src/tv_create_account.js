const { create_email } = require("../helpers/cpanel.js");
const { tv_create_account } = require("../crawlers/tv_account.js");
const { set_prop } = require("../crawlers/tv_operations.js");
// const { cpanel_verfiy_email } = require("../helpers/cpanel_verfiy_email.js")

const { initial_crawler_config, initial_logger, change_logger_label, get_initial_args } = require("../helpers/initial.js");
var logger = initial_logger();
const value = get_initial_args();


(async () => {
    logger = change_logger_label(logger, "TV_CREATE_ACC");
    logger.info("Starting")

    const [email, username, password] = await create_email();

    logger = change_logger_label(logger, "TV_INITIAL_CRAWLER")
    var page;
    try{
        logger.info("Opening browser")
        page = await initial_crawler_config()
    }
    catch(err){
        logger.error(err.message)
        process.exit(3)
    }

    res = await tv_create_account(page, email, username, password, firstname, lastname, state=1);
    logger.info(`Response of creating account first stage: ${res}`)

    // verify
    // await cpanel_verfiy_email()

    res = await tv_create_account(page, email, username, password, firstname, lastname, state=2);
    logger.info(`Response of creating account final stage: ${res}`)

    res = await set_prop(page, value)
    logger.info(`Response of setting prop: ${res}`)

    // ToDo: Sending to DB
})();