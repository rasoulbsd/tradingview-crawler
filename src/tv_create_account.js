const { create_email, write_to_file } = require("../helpers/cpanel.js");
const { tv_create_account } = require("../crawlers/tv_account.js");
const { register_API } = require("../helpers/db.js")
const { api_cpanel_verify_email } = require("../helpers/api.js")

const { initial_crawler_config, initial_logger, change_logger_label, get_initial_args } = require("../helpers/initial.js");
var logger = initial_logger();

const test = false;


(async () => {

    res = await api_cpanel_verify_email("garnette_jem_4e72d@sarmayedigital.com")
    console.log(res)
    console.log(res.data.verification_url)
    logger = change_logger_label(logger, "TV_CREATE_ACC");
    logger.info("Starting")

    const [email, username, password, acc_pass, firstname, lastname] = await create_email(test);

    logger = change_logger_label(logger, "TV_INITIAL_CRAWLER")

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
    const verification_url = await api_cpanel_verify_email(email)
    // const verification_url = await cpanel_verfiy_email(email)
    logger.info(`End of email verification`)

    await page.goto(verification_url, 
        { waitUntil: 'domcontentloaded' }
        )

    res = await tv_create_account(page, email, username, acc_pass, firstname, lastname, state=2, temp_mail=false);
    logger.info(`Response of creating account final stage: ${res}`)

    if(test == false){
        res = await register_API(email, password, acc_pass)
        logger.info(`Response of registerAPI: ${res}`)

        logger.info(`Writing verified account to verified_accounts.txt`)
        await write_to_file(email, username, password, acc_pass, firstname, lastname);
    }

    await browser.close();
    console.log("Done");
    process.exit();
})();