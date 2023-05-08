const { initial_logger, change_logger_label } = require("../helpers/initial.js")
var logger = initial_logger()

module.exports = {
    async tv_create_account(page, email, username, password, firstName, lastName, state=1, temp_mail=false){
        logger = change_logger_label(logger, "TV_CREATE_ACC")
        if(state == 1){
            logger.info("Go to tv website")
            const url = "https://www.tradingview.com/"
            await page.goto(url, 
                { waitUntil: 'domcontentloaded' }
                )

            logger.info("Opening user menu")
            await page.waitForSelector('button[aria-label="Open user menu"]');
            user_menu_btn = await page.$('button[aria-label="Open user menu"]');
            await user_menu_btn.click()

            logger.info("Click on sign in button")
            await page.waitForSelector("button[data-name=header-user-menu-sign-in]")
            sign_in_btn = await page.$("button[data-name=header-user-menu-sign-in]")
            await sign_in_btn.evaluate((el) => el.click());
        
            logger.info("Click on sign up button")
            await page.waitForSelector("div.tv-signin-dialog__inner>div>div>span>span")
            sign_up_btn = await page.$("div.tv-signin-dialog__inner>div>div>span>span")
            await sign_up_btn.click()
        
            logger.info("Click on email button")
            await page.waitForSelector('.js-show-email')
            email_btn = await page.$(".js-show-email");
            await email_btn.click()
        
            logger.info("Inserting credentials")
            await page.waitForSelector('input[name=username]')
            await page.focus('input[name=username]')
            await page.keyboard.type(username)
            await page.focus('input[name=email]')
            await page.keyboard.type(email)
            await page.focus('input[name=password]')
            await page.keyboard.type(password)
            await page.waitForSelector('input[name=gdpr]')
            await (await page.$("input[name=gdpr]")).click()

            // ToDo: handle error for incorrect credentials
            logger.warn("Waiting for user to solve captcha!")
            // console.log("Waiting for user to resolve captcha.")
            await page.waitForSelector(".tv-signin-dialog__resend", {timeout: 60000})
            if(temp_mail == true){
                logger.warn("Waiting for manual email activation!")
                // console.log("Waiting for user to Activate the email")
                console.log("\x1b[33m%s\x1b[0m", "\tTemporary Passed!")
            }
        }
        else if(state == 2){
            logger.info("Continue account creation")
            logger.info("Insert firstname and lastname")
            await page.waitForSelector('input[name=first_name]')
            await page.focus('input[name=first_name]')
            await page.keyboard.type(firstName)

            await page.waitForSelector('input[name=last_name]')
            await page.focus('input[name=last_name]')
            await page.keyboard.type(lastName)

            logger.info("Click on marketing emails button")
            await page.click("input[name=marketing_emails]")

            logger.info("Click on submit button")
            await page.click('button[type="submit"]')
        }
    
        return 'Done'
    },

    async tv_login(page, email, password){
        logger = change_logger_label(logger, "Login")

        logger.info("Go to tv website")
        const url = "https://www.tradingview.com/"
        await page.setViewport({
            width: 1200,
            height: 720,
            deviceScaleFactor: 1,
            isLandScape: true
        });
        await page.goto(url, 
            { waitUntil: 'domcontentloaded' }
            )

        logger.info("Open user menu")
        await page.waitForSelector('button[aria-label="Open user menu"]');
        // user_menu_btn = await page.$('button[aria-label="Open user menu"]');
        await page.click('button[aria-label="Open user menu"]')
    
        logger.info("Click on sign in button")
        await page.waitForSelector("button[data-name=header-user-menu-sign-in]")
        sign_in_btn = await page.$("button[data-name=header-user-menu-sign-in]")
        await sign_in_btn.evaluate((el) => el.click());
    
        logger.info("Click on email button")
        await page.waitForSelector('.js-show-email')
        email_btn = await page.$(".js-show-email");
        await email_btn.click()
    
        logger.info("Typing email and password")
        await page.waitForSelector('input[name=username]')
        await page.focus('input[name=username]')
        await page.keyboard.type(email)
        await page.focus('input[name=password]')
        await page.keyboard.type(password)
    
        logger.info("Click on remember me checkbox: disable it")
        await page.click("input[name=remember]")
    
        logger.info("Submiting login form")
        await page.click(".tv-button__loader")
    
        return page
    }
}
