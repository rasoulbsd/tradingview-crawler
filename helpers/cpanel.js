const { initial_logger, change_logger_label } = require("./initial.js")
const fs = require('fs');

var logger = initial_logger()

const axios = require('axios');
const uuid = require('uuid');
var random = require('random-name');

const cpanel_username = "sarmayed";
const cpanel_token = "ZA0WGUXZBAHISFJIXLRGLCCOB8GN3G3S";
const domain = "sarmayedigital.com"
// const cpanel_token = "AXKIMCE39RSIUZQ32GI9WLIQEQYIEFWQ";

module.exports = {
    async create_email(user='', pass='', addr=''){
        logger = change_logger_label(logger, "EMAIL_CREATION")
        logger.info("Startin creation of email in cpanel");
        const address = addr || 'https://cpanel-nl-bot1.azardata.net:2083/execute/Email/add_pop';
        const id = uuid.v4();
        random()
        const firstName= random.first()
        const lastName = random.last()
        // let username = user || (firstName + "_" + lastName + "_" + id.slice(0, 5).replace(/-/g, '.')).replaceAll(".", '');
        let password = pass || `${id}123!`;
        const username = await username_generator()
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
        return [(username + "@" + domain), username, password, firstName, lastName]
    },

    async write_to_file(email, username, password, firstname, lastname){
        await fs.appendFileSync('./verified_accounts.txt', `${email}, ${username}, ${password}, ${firstname}, ${lastname}\n`, 'utf8');
        // console.log("Data is appended to file successfully.")
        // try {
        // await fs.promises.writeFile('./verified_accounts.txt', `${email}, ${username}, ${password}, ${firstname}, ${lastname}\n`);
        //     // console.log('Data has been appended to the file.');
        //   } catch (err) {
        //     console.error(err);
        // }
    }
}

async function username_generator(){
    var email_number = ''
    try {
        email_number = await fs.promises.readFile('./email.txt', 'utf8');
      } catch (err) {
        console.error(err);
        process.exit()
      }
    // console.log("Here")
    // console.log(email_number)
    try {
        await fs.promises.writeFile('./email.txt', (parseInt(email_number)+1).toString());
      } catch (err) {
        console.error(err);
        process.exit()
      }
      return `sdf${email_number}`
}