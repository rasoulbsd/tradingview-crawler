const axios = require('axios');
const winston = require('winston');
const qs = require('qs');

module.exports = {
    async register_API(email, password, acc_pass) {
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
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }
}
