const { tv_login } = require("../crawlers/tv_account.js");
const { set_prop, paper_trading_opener, create_initial_transaction } = require("../crawlers/tv_operations.js");
const { initProp_API } = require("../helpers/db.js")

const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js");
var logger = initial_logger();

module.exports = {
    async set_prop_trans(email, password, value){
        logger = change_logger_label(logger, "TV_SET_PROP");
        logger.info("Starting")
    
        logger = change_logger_label(logger, "TV_INITIAL_CRAWLER")
        try{
            logger.info("Opening browser")
            var [page, browser] = await initial_crawler_config(headless='new', width=1000,height=850)
        }
        catch(err){
            logger.error(err.message)
            throw new Error("error in openning browser: set_prop")
        }
        logger = change_logger_label(logger, "TV_SET_PROP");
    
        // page = await tv_login(page, email, password);
        try{
            page = await tv_login(page, email, password)
            logger.info("Login Successful!")
            await page.screenshot({path: './screenshots/6-Logn_Successful!.png'});
        }
        catch(err){
            logger.error(`Error in logging in: ${err.message}`)
            await browser.close()
            throw new Error("Error in logging in in cpanel: \n"+err.message)
            // process.exit()
        }
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

        return {'message': 'Prop set successfully!', 'data': {'value': value}}
        // ToDo: Sending to DB
    }
}
