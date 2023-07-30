const { initial_crawler_config, initial_logger, change_logger_label } = require("../helpers/initial.js")
var logger = initial_logger()
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
    async tv_create_account(page, email, username, password, firstName, lastName, temp_mail=false){
        logger = change_logger_label(logger, "TV_CREATE_ACC")
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
        await page.waitForSelector('a[href="#"]')
        sign_up_btn = await page.$('a[href="#"]')
        await sign_up_btn.click()
    
        logger.info("Click on email button")
        await page.waitForSelector('button[name="Email"]')
        email_btn = await page.$('button[name="Email"]');
        await email_btn.click()
    
        logger.info("Inserting credentials")
        // await page.waitForSelector('input[name=id_username]')
        // await page.focus('input[name=id_username]')
        // await page.keyboard.type(username)
        await page.focus('input[name=id_email]')
        await page.keyboard.type(email)
        await sleep(800)
        await page.focus('input[name=id_password]')
        await page.keyboard.type(password)
        await sleep(800)
        // await page.waitForSelector('input[type=checkbox]')
        // await (await page.$("input[type=checkbox]")).click()

        // ToDo: handle error for incorrect credentials
        logger.info("Waiting for user to solve captcha!")
        var attempts = 0;
        do{
            resend_link = await page.$('a[href="#"]')
            if(resend_link == null){
                await sleep(5000)
                continue
            }
            resend_link_txt = await resend_link.evaluate((el) => el.innerText);
            if(resend_link_txt.toLowerCase().includes("resend"))
            {
                break;
            }
            if(attempts%10 == 0)
                logger.warn("Waiting for user to solve captcha! Retrying...")
            await sleep(10000);
            attempts += 1;
        }while(attempts <= 60)

        logger.info("Captcha is solved!")

        if(temp_mail == true){
            logger.warn("Waiting for manual email activation!")
            // console.log("Waiting for user to Activate the email")
            console.log("\x1b[33m%s\x1b[0m", "\tTemporary Passed!")
        }

        return 'Done'
    },

    async tv_login(page, email, password){
        logger = change_logger_label(logger, "Login")

        logger.info("Go to tv website")
        const url = "https://www.tradingview.com/"
        await page.goto(url, 
            { waitUntil: 'domcontentloaded' }
            )

        logger.info("Open user menu")
        await page.waitForSelector('button[aria-label="Open user menu"]');
        // user_menu_btn = await page.$('button[aria-label="Open user menu"]');
        await page.click('button[aria-label="Open user menu"]')
    
        logger.info("Click on sign in button")
        // screenshot
        await page.screenshot({path: './screenshots/1-Click_on_sign_in_button.png'});
        await page.waitForSelector("button[data-name=header-user-menu-sign-in]")
        sign_in_btn = await page.$("button[data-name=header-user-menu-sign-in]")
        await sign_in_btn.evaluate((el) => el.click());
    
        logger.info("Click on email button")
        await page.screenshot({path: './screenshots/2-Click_on_email_button.png'});
        await page.waitForSelector('button[name="Email"]', {timeout: 60000*2})
        email_btn = await page.$('button[name="Email"]');
        await email_btn.click()
    
        logger.info("Typing email and password")
        await page.screenshot({path: './screenshots/3-Typing_email_and_password.png'});
        await page.waitForSelector('input[name=id_username]')
        await page.focus('input[name=id_username]')
        await page.keyboard.type(email)
        await sleep(1000)
        await page.focus('input[name=id_password]')
        await page.keyboard.type(password)
        await sleep(1000)
    
        logger.info("Click on remember me checkbox: disable it")
        await page.screenshot({path: './screenshots/4-Click_on_remember_me_checkbox:_disable_it.png'});
        await page.click("input[type=checkbox]")
    
        logger.info("Submiting login form")
        await page.screenshot({path: './screenshots/5-Submiting_login_for.png'});
        await page.click("form button")

        // try_count = 0;
        // do{
        //     reCaptcha_num = await page.$$('iframe[title="reCAPTCHA"]')
        //     if (reCaptcha_num.length == 2){
        //         logger.error(`reCaptcha found!: reCaptcha_num_len=${reCaptcha_num.length}`)
                // await sleep(10000)
        //         throw new Error(`reCaptcha found!: reCaptcha_num_len=${reCaptcha_num.length}`)
        //     }
        //     try_count += 1;
        //     await sleep(1000)
        // }while(reCaptcha_num.length != 2 && try_count <= 10)
        // if(try_count >= 10){
        //     logger.error(`reCaptcha found!: reCaptcha_num_len=${reCaptcha_num.length}`)
        //     throw new Error(`reCaptcha found!: reCaptcha_num_len=${reCaptcha_num.length}`)
        // }

        // await page.

        return page
    },

    async verify_email(verification_url){
        try{
            logger.info("Opening browser")
            var [page, browser] = await initial_crawler_config(headless='new')
        }
        catch(err){
            logger.error(err.message)
            throw new Error(`error in verfing email: openning browser: \n${err.message}`)
            process.exit(3)
        }

        await page.goto(verification_url, 
            { waitUntil: 'domcontentloaded' }
            )

        // logger.info("Continue account creation")
        // logger.info("Insert firstname and lastname")
        // await page.waitForSelector('input[name=first_name]')
        // await page.focus('input[name=first_name]')
        // await page.keyboard.type(firstName)

        // await page.waitForSelector('input[name=last_name]')
        // await page.focus('input[name=last_name]')
        // await page.keyboard.type(lastName)

        logger.info("Click on policy button")
        await page.waitForSelector('input[type=checkbox]')
        checkboxes = await page.$$("input[type=checkbox]")
        await checkboxes[1].click()

        logger.info("Click on submit button")
        await page.click('form button')

        await browser.close()

        return 'Done'
    }
}
