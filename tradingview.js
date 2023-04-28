const puppeteer = require('puppeteer-extra');
const uuid = require('uuid');
// const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
var random = require('random-name')
var userAgent = require('user-agents');

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString())

    const id = uuid.v4();
    // var [firstName, lastName] = id.split('-');
    random()
    const firstName= random.first()
    const lastName = random.last()
    // firstName = 'a' + firstName
    // lastName = 'b' + lastName
    let username = (firstName + lastName + id.slice(0, 30).replace(/-/g, '.')).replaceAll(".", '');
    let password = `${id}123!`;
    let email = "";

    let res_creation = await tv_create_account(page, email, username, password, firstName, lastName);
    if(res_creation == 'Done'){
        console.log(`----------------
            Email: ${email}\
            Username: ${username}\
            Password: ${password}\
            First Name: ${firstName}\
            Last Name: ${lastName}\
            -------------------`)
    }
    else{
        console.log("\x1b[31m%s\x1b[0m", "Error in Creating TradingView Account") //red
        process.exit()
    }

    await sleep(20000);
    // email = "desab19561@loongwin.com"
    // username = "BrearLaudf92cafd6a3d249968bcd38b6e0"
    // password = "f92cafd6-a3d2-4996-8bcd-38b6e08dd0e2123!"
    var [res, signed_in_page] = await tv_login(browser, email, username, password)
    if (res == 'Done'){
        console.log('\x1b[32m%s\x1b[0m', "Login Successful!") //green
    }
    else{
        console.log("\x1b[31m%s\x1b[0m", "Error in logging in") //red
        process.exit()
    }

    res = await tv_functions(signed_in_page, value='1000');
    if(res == 'Done'){
        console.log(`The account for value: ${value} has been created successfully!`)
    }

})();

async function tv_create_account(page, email, username, password, firstName, lastName){
    const url = "https://www.tradingview.com/"
    await page.goto(url, 
        { waitUntil: 'domcontentloaded' }
        )

    await page.waitForSelector('button[aria-label="Open user menu"]');
    user_menu_btn = await page.$('button[aria-label="Open user menu"]');
    await user_menu_btn.click()
    
    await page.waitForSelector("button[data-name=header-user-menu-sign-in]")
    sign_in_btn = await page.$("button[data-name=header-user-menu-sign-in]")
    await sign_in_btn.evaluate((el) => el.click());

    await page.waitForSelector("div.tv-signin-dialog__inner>div>div>span>span")
    sign_up_btn = await page.$("div.tv-signin-dialog__inner>div>div>span>span")
    await sign_up_btn.click()

    await page.waitForSelector('.js-show-email')
    email_btn = await page.$(".js-show-email");
    await email_btn.click()

    await page.waitForSelector('input[name=username]')
    await page.focus('input[name=username]')
    await page.keyboard.type(username)
    await page.focus('input[name=email]')
    await page.keyboard.type(email)
    await page.focus('input[name=password]')
    await page.keyboard.type(password)
    await page.waitForSelector('input[name=gdpr]')
    await (await page.$("input[name=gdpr]")).click()

    console.log("Waiting for user to resolve captcha.")
    await page.waitForSelector(".tv-signin-dialog__resend")


    console.log("Waiting for user to Activate the email")
    console.log("\x1b[33m%s\x1b[0m", "\tTemporary Passed!")

    await page.waitForSelector('input[name=first_name]')
    await page.focus('input[name=first_name]')
    await page.keyboard.type(first_name)

    await page.waitForSelector('input[name=last_name]')
    await page.focus('input[name=last_name]')
    await page.keyboard.type(last_name)

    await page.click("input[name=marketing_emails]")

    return 'Done'
}

async function tv_login(browser, email, username, password){
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString())

    const url = "https://www.tradingview.com/"
    await page.goto(url, 
        { waitUntil: 'domcontentloaded' }
        )

    await page.waitForSelector('button[aria-label="Open user menu"]');
    // user_menu_btn = await page.$('button[aria-label="Open user menu"]');
    await page.click('button[aria-label="Open user menu"]')
    
    await page.waitForSelector("button[data-name=header-user-menu-sign-in]")
    sign_in_btn = await page.$("button[data-name=header-user-menu-sign-in]")
    await sign_in_btn.evaluate((el) => el.click());

    await page.waitForSelector('.js-show-email')
    email_btn = await page.$(".js-show-email");
    await email_btn.click()

    await page.waitForSelector('input[name=username]')
    await page.focus('input[name=username]')
    await page.keyboard.type(email)
    await page.focus('input[name=password]')
    await page.keyboard.type(password)

    await page.click("input[name=remember]")

    await page.click(".tv-button__loader")

    return ['Done', page]
}

async function tv_functions(page, value){
    await sleep(10000)
    await page.waitForSelector("div[data-name=base]")
    await page.click("div[data-name=base]")
    
    await page.waitForSelector('button[aria-label="Open menu"]');
    // user_menu_btn = await page.$('button[aria-label="Open menu"]');
    await page.click('button[aria-label="Open menu"]')
    

    await page.waitForSelector("div[aria-label=Menu]")
    sign_in_btn = await page.$("div[aria-label=Menu] button")
    await sign_in_btn.evaluate((el) => el.click());

    await page.waitForSelector('a[data-main-menu-dropdown-track-id="Chart+"]')
    email_btn = await page.$('a[data-main-menu-dropdown-track-id="Chart+"]');
    await email_btn.click()

    await page.waitForSelector("div[data-name=order-panel-button]")    // order_panel_btn = await page.$('div[data-name=order-panel-button]');
    await sleep(1000)
    await page.click('div[data-name=order-panel-button]')

    console.log("Clicking on connect button")
    await page.waitForSelector("div[data-broker=Paper] button")

    connect_btn = await page.$("div[data-broker=Paper] button")
    await page.evaluate((el) => el.click(), connect_btn);

    await page.waitForSelector("button[name=broker-login-submit-button]")
    await page.click("button[name=broker-login-submit-button]")

    await page.waitForSelector("div.js-account-manager-header span")
    paper_trading_btn = await page.$("div.js-account-manager-header span")

    await page.evaluate((el) => el.click(), paper_trading_btn);

    await page.waitForSelector("div[data-name=menu-inner]>div>span")
    await page.click("div[data-name=menu-inner]>div>span")
    
    await sleep(4000)

    await page.focus('input[inputmode="numeric"]')
    console.log(`Value: ${value}`)
    await page.keyboard.type(value)

    await page.waitForSelector("button[name=submit]")
    await page.click("button[name=submit]")

    do{
        await page.click('div[data-name="order-panel-button"]')
        clicked = await page.$('button#Market')
        await sleep(200)
    }while(clicked == null)
    console.log("The button for order panel clicked!")

    await page.waitForSelector("button#Market")
    await page.click("button#Market")


    checkboxs = await page.$$("input[type=checkbox]")
    await checkboxs[0].evaluate((el) => el.click());
    await checkboxs[1].evaluate((el) => el.click());

    await page.click('div[data-name="order-panel"] > div > div > div > button')
    await sleep(10000);
    console.log('\x1b[32m%s\x1b[0m', "Order Sent") // green
    await sleep(500000);

    return ['Done', page]
    await sleep(500000);
}