const puppeteer = require('puppeteer-extra');
var userAgent = require('user-agents');

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const sleep = ms => new Promise(r => setTimeout(r, ms));

const email = "test-rasoul@bestprojectt.ir"
const username = "bestproj"
const password = "x3s7Tx6AfH]4Z:"
const url = "https://cpanel-nl-bot1.azardata.net:2083/"

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString())

    const email_page = await login(page);

    await check_email(email_page);
})();


async function login(page){
    await page.goto(url, 
        { waitUntil: 'domcontentloaded' }
        )
    await page.waitForSelector('input[name=user]')
    await page.focus('input[id=user]')
    await page.keyboard.type(username)
    await page.focus('input[id=pass]')  
    await page.keyboard.type(password)
    await page.waitForSelector('button[name=login]')
    await (await page.$("button[name=login]")).click()

    await page.waitForSelector('a[id=item_email_accounts]');
    await page.click('a[id=item_email_accounts]')

    await page.waitForSelector('input[id=email_table_search_input]')
    await page.focus('input[id=email_table_search_input]')
    await page.keyboard.type(email)
    
    await sleep(3000)
    await page.keyboard.press("Enter")

    // Clicking on the CheckMail Button for the email.
    let try_count = 0;
    let check_email_btn = '';
    do{
        check_email_btn = await page.$(`a[id="email_table_menu_webmail_${email}"]`);
        try_count += 1;
        await sleep("500")
    }while(try_count <= 10 && check_email_btn == null)
    await check_email_btn.click()

    return (await browser.pages())[(await browser.pages()).length-1];
}


async function check_email(page){
    await page.waitForSelector('table[id="messagelist"]');
    console.log("In Email Page")
    await sleep(200000)
}