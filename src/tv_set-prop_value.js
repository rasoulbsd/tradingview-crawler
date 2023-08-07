const { tv_login } = require("../crawlers/tv_account.js");
const { set_prop, paper_trading_opener, create_initial_transaction } = require("../crawlers/tv_operations.js");
const { initProp_API } = require("../helpers/db.js")

const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js");
var logger = initial_logger();

module.exports = {
    async set_prop_trans(email, password, value, browser){
        page = (await browser.pages())[1]

        logger = change_logger_label(logger, "TV_SET_PROP");
        page = await paper_trading_opener(page);
    
        res = await set_prop(page, value)
        logger.info(`Response of setting prop: ${res}`)
    
        res = await create_initial_transaction(page)
        logger.info(`Response of setting prop: ${res}`)
    
        logger.info(`Sending to DB`)
        res = await initProp_API(email, value);
        logger.info(`Response of setting prop: ${res}`)
    
        console.log("Done")

        // await browser.close()

        // return {'message': 'Prop set successfully!', 'data': {'value': value}}
        // ToDo: Sending to DB
    }
}
