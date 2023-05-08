const { initial_logger, change_logger_label } = require("../helpers/initial.js");
var logger = initial_logger();


const sleep = ms => new Promise(r => setTimeout(r, ms));

const cpanel_username =  "sarmayed";
const cpanel_passwrod = "56c#5sN4LVeK2=F0"
const url = "https://cpanel-nl-bot1.azardata.net:2083/";

module.exports = {
    async cpanel_verfiy_email(browser, email, username=cpanel_username, password=cpanel_passwrod){
        logger = change_logger_label(logger, "CPANEL_EMAIL_VERIFI");
        // const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        // await page.setUserAgent(userAgent.random().toString())

        const email_page = await login(page, browser, email, username, password);

        return (await check_email(browser))
    }
}

async function login(page, browser, email, username, password){
    logger.info("Go to Cpanel login page")
    await page.goto(url, 
        { waitUntil: 'domcontentloaded' }
        )
    logger.info("Inserting cpanel credentials")
    await page.waitForSelector('input[name=user]')
    await page.focus('input[id=user]')
    await page.keyboard.type(username)
    await sleep(200)
    await page.focus('input[id=pass]')  
    await page.keyboard.type(password)
    await sleep(200)
    await page.waitForSelector('button[name=login]')
    await (await page.$("button[name=login]")).click()

    logger.info("Go to email page in cpanel")
    await page.waitForSelector('a[id=item_email_accounts]');
    await page.click('a[id=item_email_accounts]')

    // Clicking on the CheckMail Button for the email.
    logger.info("Search for email")
    let check_email_btn = null;
    let try_count = 0;
    while(check_email_btn == null){
        if(try_count != 0){
            let cancel_or_search_btn = await page.$("#email_table_search_submit_btn");
            await cancel_or_search_btn.click();
        }
        await page.waitForSelector('input[id=email_table_search_input]')
        await page.focus('input[id=email_table_search_input]')
        await page.keyboard.type(email)
        
        await sleep(2000)
        await page.keyboard.press("Enter")

        try_count = 0;

        do{
            check_email_btn = await page.$(`a[id="email_table_menu_webmail_${email.toLowerCase()}"]`);
            try_count += 1;
            await sleep(500)
        }while(try_count <= 10 && check_email_btn == null)
        logger.warn("Email is not found! Retrying...")
    }
    await check_email_btn.click()
    return page;
    // return (await browser.pages())[(await browser.pages()).length-1];
}


async function check_email(browser){
    logger.info("In roundcube")
    await sleep(10000)
    var page = (await browser.pages())[(await browser.pages()).length-1];

    let try_count = 0;
    var open_mail_btn = null;
    do{
        open_mail_btn = await page.$('#launchActiveButton')
        try_count += 1;
        await sleep(1000);
    }while(try_count <= 30 && open_mail_btn == null)
    await open_mail_btn.evaluate((el) => el.click());

    await page.waitForSelector('table[id="messagelist"]', {timeout: 90000})
    logger.info("In Email Page")
    do{
        logger.warn("Waiting for verification email")
        verification_email = await page.$('#messagelist tbody td.subject a')
        if(verification_email != null)
            break
        await sleep(4000);
    }while(try_count <= 15 && verification_email == null)

    if(verification_email == null){
        logger.error("Email verification was not delivered! Waited for 60 sec");
        process.exit();
    }
    else{
        logger.info("Go to the verification email: two double clicking");
        await double_click(page, selector="#messagelist tbody td.subject a")
        await double_click(page, selector="#messagelist tbody td.subject a")

        logger.info("Click on verfiy this account");
        await page.waitForSelector('td[align="center"] > a');
        verify_btn = (await page.$$('td[align="center"] > a'))[1];
        await verify_btn.click();
    }
    await sleep(5000)
    return (await browser.pages())[(await browser.pages()).length-1];
}

async function double_click(page, selector){
    const rect = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const { x, y } = element.getBoundingClientRect();
        return { x, y };
    }, selector);
    await page.mouse.click(rect.x, rect.y, { clickCount: 2 });
}