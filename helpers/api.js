const axios = require('axios');
const { initial_logger, change_logger_label } = require("../helpers/initial.js");
var logger = initial_logger();

module.exports = {
    async api_cpanel_verify_email(email) {
        logger = change_logger_label(logger, "API_REGISTER");

        const data = {
            email
        };

        await axios.post('91.107.215.42:8000/cpanel_verfiy_email', data)
            .then((response) => {
                logger.info("Send to API successfully!")
                return response
            })
            .catch((error) => {
                logger.info("Error in sending to API: " + error.message)
            });
    }
}
