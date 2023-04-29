const uuid = require('uuid');
var random = require('random-name')

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