const { tv_login } = require("../crawlers/tv_account.js");
const { set_prop, paper_trading_opener, create_initial_transaction } = require("../crawlers/tv_operations.js");
const { initProp_API } = require("../helpers/db.js")
const fs = require('fs');

const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js");
const { recaptcha_checker } = require("../helpers/account.js")
var logger = initial_logger();

module.exports = {
    async acc_login(email, password){
        logger = change_logger_label(logger, "TV_SET_PROP");
        logger.info("Starting")
    
        logger = change_logger_label(logger, "TV_INITIAL_CRAWLER")
        try{
            logger.info("Opening browser")
            var [page, browser] = await initial_crawler_config(headless=false, width=1400,height=1080)
        }
        catch(err){
            logger.error(err.message)
            throw new Error("error in openning browser: set_prop")
        }    
        // page = await tv_login(page, email, password);
        try{
            page = await tv_login(page, email, password)
            logger.info("Login Successful!")
        }
        catch(err){
            logger.error(`Error in logging in: ${err.message}`)
            await browser.close()
            throw new Error("Error in logging into account: \n"+err.message)
            // process.exit()
        }

        if(await recaptcha_checker(page)){
            return [browser, "Warning! reCaptcha found!"]
        }
        else{
            return [browser, "Login Successfull!"]
        }
    }
}
