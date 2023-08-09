const { tv_login } = require("../crawlers/tv_account.js")
const { paper_trading_opener, csv_exporter } = require("../crawlers/tv_operations.js")
const { export_API } = require("../helpers/db.js")
const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js")
const { page_status_checker } = require("../helpers/account.js");

var logger = initial_logger()

module.exports = {
    async export_csv(email, password, browser){
        // logger = change_logger_label(logger, "INITIAL")
        // try{
        //     logger.info("Opening browser")
        //     var [page, browser] = await initial_crawler_config(headless='new', width=1000,height=850)
        // }
        // catch(err){
        //     logger.error(err)
        //     console.log(err)
        //     throw new Error("error in openning browser: in export csv: " + err.message)
        // }
    
        // logger = change_logger_label(logger, "URL")
        // const url = "https://www.tradingview.com/"
        // logger.info(`Opening tv url: ${url}`)
        // try{
        //     await page.goto(url, { waitUntil: 'domcontentloaded' })
        // }
        // catch(err){
        //     logger.error(err.message)
        //     await browser.close()
        //     throw new Error("error in export_csv: "+err.message)
        // }
    
        // let signed_in_page;
        // try{
        //     signed_in_page = await tv_login(page, email, password)
        //     logger.info("Login Successful!")
        // }
        // catch(err){
        //     logger.error(`Error in logging in: ${err.message}`)
        //     await browser.close()
        //     throw new Error("Error in logging into account: \n"+err.message)
        //     // process.exit()
        // }
        
        try{
            page = (await browser.pages())[1]
        }
        catch(error){
            throw new Error("Error: It seems there is no browser opened for this. Try openning the browser by calling desired API first")
        }

        res = await page_status_checker(page)
        if(!res.message.toLowerCase().includes("successfull")){
            throw new Error(res.message)
        }
        logger = change_logger_label(logger, "EXPORTING_CSV")

        let paper_trading_page = await paper_trading_opener(page);
    
        const string_paths = await csv_exporter(paper_trading_page, email)
    
        logger = change_logger_label(logger, "EXPORTING_CSV")

        console.log(string_paths)
        res = await export_API(email, string_paths)
        logger.info(`Response of sending to export_API: ${res}`)

        console.log("Done!")

        await browser.close()

        return {'message': 'CSVs exported successfully!', 'data': {'url_path': string_paths.split(" | ")}}
    }
}
