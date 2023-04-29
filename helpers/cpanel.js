const { initial_logger, change_logger_label } = require("./initial.js")
var logger = initial_logger()

const axios = require('axios');
const uuid = require('uuid');
var random = require('random-name');

const cpanel_username = "bestproj";
const cpanel_token = "AXKIMCE39RSIUZQ32GI9WLIQEQYIEFWQ";

module.exports = {
    async create_email(user='', pass='', domain=''){
        logger = change_logger_label(logger, "EMAIL_CREATION")
        logger.info("Startin creation of email in cpanel");
        const address = domain || 'https://cpanel-nl-bot1.azardata.net:2083/execute/Email/add_pop';
        const id = uuid.v4();
        random()
        const firstName= random.first()
        const lastName = random.last()
        let username = user || (firstName + "_" + lastName + "_" + id.slice(0, 5).replace(/-/g, '.')).replaceAll(".", '');
        let password = pass || `${id}123!`;

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
        return [(username + "@" + address), username, password]
    }
}