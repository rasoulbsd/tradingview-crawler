const { initial_crawler_config, initial_logger, change_logger_label } = require("./initial.js")
const fs = require('fs');
const axios = require('axios');
const uuid = require('uuid');
var random = require('random-name');
const sleep = ms => new Promise(r => setTimeout(r, ms));

var logger = initial_logger()

const cpanel_username = "sarmayed";
const cpanel_passwrod = "56c#5sN4LVeK2=F0"
const cpanel_token = "ZA0WGUXZBAHISFJIXLRGLCCOB8GN3G3S";
// const cpanel_token = "AXKIMCE39RSIUZQ32GI9WLIQEQYIEFWQ";
const domain = "sarmayedigital.com"
const url = "https://cpanel-nl-bot1.azardata.net:2083/";


module.exports = {
    async create_email(test=false, user='', pass='', addr=''){
        logger = change_logger_label(logger, "EMAIL_CREATION")
        logger.info("Startin creation of email in cpanel");
        const address = addr || 'https://cpanel-nl-bot1.azardata.net:2083/execute/Email/add_pop';
        random()
        const firstName= random.first()
        const lastName = random.last()
        // let username = user || (firstName + "_" + lastName + "_" + id.slice(0, 5).replace(/-/g, '.')).replaceAll(".", '');
        let acc_pass = pass || `${uuid.v4().slice(0,11)}!`;
        let password = pass || `${uuid.v4().slice(0,11)}!${uuid.v4().slice(3, 9)}`
        const username = await username_generator(test)
        const config = {
            params: {
                email: username,
                password: password 
            },
            headers: {
                'Authorization': `cpanel ${cpanel_username}:${cpanel_token}`
            }
        };

        const res = await axios.get(address, config)
            .then(response => {
                logger.info(`Successfully created email: StatusText: ${response.statusText}`);
                return response;
            })
            .catch(error => {
                logger.error(`Error in creating email: ${error.message}`);
                process.exit()
            });

        // ToDo: Send to db
        // return [username, password, firstName, lastName];
        return [(username + "@" + domain), `${username}_sarmayedigital`, password, acc_pass, firstName, lastName]
    },

    async write_to_file(email, username, password, acc_pass, firstname, lastname){
        await fs.appendFileSync('./verified_accounts.txt', `${email}, ${username}, ${password}, ${acc_pass}, ${firstname}, ${lastname}\n`, 'utf8');
        // console.log("Data is appended to file successfully.")
        // try {
        // await fs.promises.writeFile('./verified_accounts.txt', `${email}, ${username}, ${password}, ${firstname}, ${lastname}\n`);
        //     // console.log('Data has been appended to the file.');
        //   } catch (err) {
        //     console.error(err);
        // }
    },

    async cpanel_verfiy_email(email, username=cpanel_username, password=cpanel_passwrod){
        logger = change_logger_label(logger, "CPANEL_EMAIL_VERIFI");

        try{
            logger.info("Opening browser")
            var [page, browser] = await initial_crawler_config(headless='new')
        }
        catch(err){
            logger.error(err.message)
            process.exit(3)
        }

        const email_page = await cpanel_login(page, email, username, password);

        const verification_url = await check_email(browser)

        return verification_url
    }
}

async function username_generator(test){
    var email_number = ''
    const file_name = (test) ? "./email-test.txt" : "./email.txt"
    try {
        email_number = await fs.promises.readFile(file_name, 'utf8');
      } catch (err) {
        console.error(err);
        process.exit()
      }
    // console.log("Here")
    // console.log(email_number)
    try {
        await fs.promises.writeFile(file_name, (parseInt(email_number)+1).toString());
      } catch (err) {
        console.error(err);
        process.exit()
      }

      return `sdf${email_number}`
}

async function cpanel_login(page, email, username, password){
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
    while((await browser.pages()).length != 3 ){
        await sleep(500);
    }
    var opened = false;
    var attempts = 0;
    while(attempts <= 15 && opened == false){
        var page = (await browser.pages())[(await browser.pages()).length-1];
        try{
            var open_mail_btn = await page.$('#launchActiveButton')
            await open_mail_btn.evaluate((el) => el.click());

            opened = true;
        }
        catch(err){
            if(attempts%2 == 0)
                logger.warn(`Open mail button not found: Retrying...`)
            opened = false;
        }
        await sleep(1000);
        attempts += 1;
    }
    if(attempts > 15){
        logger.error("Error in navigating to roundcube!: open mail button not found: waited for 15sec")
        process.exit()
    }
    logger.info("In roundcube")

    await page.waitForSelector('table[id="messagelist"]', {timeout: 60000*10})
    logger.info("In Email Page")
    try_count = 0;
    do{
        if(try_count%2 == 0)
            logger.warn("Waiting for verification email")
        var verification_email = await page.$('#messagelist tbody td.subject a')
        if(verification_email != null)
            break
        await sleep(4000);
        try_count += 1
    }while(try_count <= 15 && verification_email == null)

    if(verification_email == null){
        logger.error("Email verification was not delivered! Waited for 60 sec");
        process.exit();
    }
    else{
        logger.info("Go to the verification email: two double clicking");
        await double_click(page, selector="#messagelist tbody td.subject a")
        await double_click(page, selector="#messagelist tbody td.subject a")

        logger.info("Find verification url");
        await page.waitForSelector('td[align="center"] > a');
        verify_btn = (await page.$$('td[align="center"] > a'))[1];
        var verification_url = await page.evaluate(() => {
            const element = document.querySelectorAll('td[align="center"] > a')[1];
            if (!element) return null;
            return element.href
        });
        // await verify_btn.click();
    }
    // await sleep(5000)
    return verification_url
    // return (await browser.pages())[(await browser.pages()).length-1];
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