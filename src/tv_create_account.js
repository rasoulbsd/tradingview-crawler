const { create_email, write_to_file } = require("../helpers/cpanel.js");
const { tv_create_account } = require("../crawlers/tv_account.js");
const { set_prop } = require("../crawlers/tv_operations.js");
const { cpanel_verfiy_email } = require("../helpers/cpanel_verfiy_email.js")
const { register_API } = require("../helpers/db.js")

const { initial_crawler_config, initial_logger, change_logger_label, get_initial_args } = require("../helpers/initial.js");
var logger = initial_logger();
const sleep = ms => new Promise(r => setTimeout(r, ms));

// const value = get_initial_args();


(async () => {
    logger = change_logger_label(logger, "TV_CREATE_ACC");
    logger.info("Starting")

    const [email, username, password, acc_pass, firstname, lastname] = await create_email();

    logger = change_logger_label(logger, "TV_INITIAL_CRAWLER")
    // var page;
    // var browser;
    try{
        logger.info("Opening browser")
        var [page, browser] = await initial_crawler_config()
    }
    catch(err){
        logger.error(err.message)
        process.exit(3)
    }

    console.log(email)
    console.log(username)
    console.log(password)
    console.log(firstname)
    console.log(lastname)
    res = await tv_create_account(page, email, username, acc_pass, firstname, lastname, state=1, temp_mail=false);
    logger.info(`Response of creating account first stage: ${res}`)

    // verify
    const after_verification_page = await cpanel_verfiy_email(browser, email)
    logger.info(`End of email verification`)

    res = await tv_create_account(after_verification_page, email, username, acc_pass, firstname, lastname, state=2, temp_mail=false);
    logger.info(`Response of creating account final stage: ${res}`)

    res = await register_API(email, password, acc_pass)
    logger.info(`Response of registerAPI: ${res}`)

    logger.info(`Writing verified account to verified_accounts.txt`)
    await write_to_file(email, username, password, acc_pass, firstname, lastname);

    // res = await set_prop(page, value)
    // logger.info(`Response of setting prop: ${res}`)

    // await create_initial_transaction(page)

    await browser.close();
    console.log("Done");
    process.exit();
})();