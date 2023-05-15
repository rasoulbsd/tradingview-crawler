const express = require('express');
const logger = require('morgan');
const { initial_logger, change_logger_label } = require("../helpers/initial.js");
const { create_email, write_to_file, cpanel_verfiy_email } = require("../helpers/cpanel.js");

// var logger = initial_logger();
// logger = change_logger_label(logger, "TV_CREATE_ACC_API");

// const router = require("./routes")
const app = express();

const PORT = 8000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(router);

// Endpoint for verifying email
app.post('/cpanel_verfiy_email', async (req, res) => {
  const { email } = req.body;
  const verification_url = await cpanel_verfiy_email(email);
  // logger.info(`End of email verification`);
  res.send({'data': verification_url, 'error': ''}); // Return verification url from cpanel_verfiy_email function
});

// Start server on port 3000
// app.listen()
// module.exports = app;

app.listen(PORT, () => console.log(`API IS RUNNING ON PORT: ${PORT}`));