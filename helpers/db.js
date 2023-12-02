const axios = require('axios');
const winston = require('winston');
const qs = require('qs');
const { initial_logger, change_logger_label } = require("../helpers/initial.js");
var logger = initial_logger();

module.exports = {
    async register_API(email, password, acc_pass) {
        logger = change_logger_label(logger, "API_REGISTER");

        const data = {
        email: email,
        password: `${password} ||| ${acc_pass}`
        };

        const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        };

        await axios.post('https://sarmayedigital.com/bot/api/?action=register', qs.stringify(data), config)
        .then((response) => {
            logger.info("Send to API successfully!")
        })
        .catch((error) => {
            logger.info("Error in sending to API: " + error.message)
        });
    },

    async export_API(email, filename) {
        logger = change_logger_label(logger, "API_EXPORT");

        const data = {
                        email,
                        filename
                    };

        const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        };

        await axios.post('https://sarmayedigital.com/bot/api/?action=export', qs.stringify(data), config)
        .then((response) => {
            logger.info("Send to API successfully!")
        })
        .catch((error) => {
            logger.info("Error in sending to API: " + error.message)
        });
    },

    async initProp_API(email, amout) {
        logger = change_logger_label(logger, "API_INIT-PROP");

        const data = {
        email,
        amout
        };

        const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        };

        await axios.post('https://sarmayedigital.com/bot/api/?action=initProp', qs.stringify(data), config)
        .then((response) => {
            logger.info("Send to API successfully!")
        })
        .catch((error) => {
            logger.info("Error in sending to API: " + error.message)
        });
    }
}
