const { initial_logger, change_logger_label } = require("../helpers/initial.js");
var logger = initial_logger();



module.exports = {
    async session_status(page){
        logger = change_logger_label(logger, "SESSION_CHECKER")
        await page.reload({ waitUntil: ["domcontentloaded"] });

        let try_count = 0;
        do{
            if(try_count > 5){
                logger.info("Session is still valid.")
                return false;
            }
            connect_btn = await page.$('div[data-dialog-name="gopro"] > div > button');
            await page.waitForTimeout(1000);
            try_count += 1;
        }while(connect_btn == null)

        logger.warn("Session is expired: clicking on connect button.")
        await connect_btn.click();
        return true;
    },

    async back_to_main_page(page){
        logger = change_logger_label(logger, "BACK_TO_MAIN_PAGE")
        if(page.url() == 'https://www.tradingview.com/'){
            logger.info("Already in main page.")
            return true;
        }
        else{
            await page.goto('https://www.tradingview.com/', {waitUntil: 'domcontentloaded'});
            logger.warn("Back to main page.")
            return false;
        }
    },

    async recaptcha_checker(page){
        logger = change_logger_label(logger, "CHECKING_RECAPTCHA")
        let try_count = 0;

        do{
            if(try_count > 10){
                logger.warn("Recaptcha is detected.")
                return true;
            }
            account_signin_form = await page.$('form[action="/accounts/signin/"]');
            await page.waitForTimeout(500);
            try_count += 1;
        }while(account_signin_form != null)

        logger.info("There is no recaptcha.")
        return false;
    },

    async page_status_checker(page){
        logger = change_logger_label(logger, "PAGE_STATUS_CHECKER")
        if(await module.exports.recaptcha_checker(page))
            return {"data": "", "Error": "Account is not signed in: Recaptcha is detected", "message": "Please solve the recaptcha and recall the API"};

        if(await module.exports.back_to_main_page(page)){
            logger.warn("Waiting for 1 sec: Backing to main page")
            await page.waitForTimeout(1000);
        }

        if(await module.exports.session_status(page)){
            logger.warn("Waiting for 1 sec: Validating Session")
            await page.waitForTimeout(1000);
        }
        logger = change_logger_label(logger, "PAGE_STATUS_CHECKER")
        logger.info("All check is done.")
        return {"data": "", "Error": "", "message": "Check successfully done"};
    },

    async writeCookies(page, cookiesPath) {
        const client = await page.target().createCDPSession();
        // This gets all cookies from all URLs, not just the current URL
        const cookies = (await client.send("Network.getAllCookies"))["cookies"];

        console.log("Saving", cookies.length, "cookies");
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
        // await fs.writeJSON(cookiesPath, cookies);
    },
    async restoreCookies(page, cookiesPath) {
        try {
            // const cookies = await fs.readJSON(cookiesPath);
            let buf = fs.readFileSync(cookiesPath);
            let cookies = JSON.parse(buf);
            console.log("Loading", cookies.length, "cookies into browser");
            await page.setCookie(...cookies);
        } catch (err) {
            console.log("restore cookie error", err);
        }
    }
}
