const express = require('express');
const logger = require('morgan');
const { initial_logger, change_logger_label } = require("../helpers/initial.js");
const { create_email, write_to_file, cpanel_verfiy_email } = require("../helpers/cpanel.js");
const { set_prop_trans } = require("./tv_set-prop_value.js");
const { export_csv } = require("./tv_csv_exporter.js");

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
  const api_response = await cpanel_verfiy_email(req.body.email);
  res.send({'data': api_response.data, 'message': api_response.message, 'error': ''}); // Return verification url from cpanel_verfiy_email function
});

// Endpoint for verifying email
app.post('/set_prop_trans', async (req, res) => {
  const api_response = await set_prop_trans(req.body.email, req.body.password, req.body.value);
  res.send({'data': api_response.data, 'message': api_response.message ,'error': ''}); // Return verification url from cpanel_verfiy_email function
});

// Endpoint for verifying email
app.post('/export_csv', async (req, res) => {
  const api_response = await export_csv(req.body.email, req.body.password);
  res.send({'data': api_response.data, 'message': api_response.message, 'error': ''}); // Return verification url from cpanel_verfiy_email function
});


// Start server on port 3000
// app.listen()
// module.exports = app;

app.listen(PORT, () => console.log(`API IS RUNNING ON PORT: ${PORT}`));