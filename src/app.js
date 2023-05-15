const express = require('express');
const logger = require('morgan');
const { initial_logger, change_logger_label } = require("../helpers/initial.js");
const { create_email, write_to_file, cpanel_verfiy_email } = require("../helpers/cpanel.js");
const { set_prop_trans } = require("./tv_set-prop_value.js");
const { export_csv } = require("./tv_csv_exporter.js");
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');


// Define a secret key for JWT signing
const secretKey = 'SJsj278o()*S2983hdjhuNSH8nufjh509kguhcxmn';
const jwt_username = "sarmaye_admin"
const jwt_password = "js28Fh43j9j@*J09"

// var logger = initial_logger();
// logger = change_logger_label(logger, "TV_CREATE_ACC_API");

// const router = require("./routes")
const app = express();

const PORT = 8000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(router);

// Define route for generating JWT tokens
app.post('/login', async (req, res) => {
  try {
    // Get the username and password from the request body
    const { username, password } = req.body;

    // Check if the username and password are valid (e.g. by querying a database)
    if (!(username === jwt_username && password === jwt_password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token with a 1-hour expiration time
    const token = jwt.sign({}, secretKey, { expiresIn: '96h' });

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating token' });
  }
});

// Endpoint for verifying email
app.post('/cpanel_verfiy_email', async (req, res) => {
  try{
    var api_response = await cpanel_verfiy_email(req.body.email);
  }
  catch(err){
    console.log(err)
    res.send({'data': {}, 'message': 'Something went wrong', 'error': err.message}); // Return verification url from cpanel_verfiy_email function
  }
  res.send({'data': api_response.data, 'message': api_response.message, 'error': ''}); // Return verification url from cpanel_verfiy_email function
});

// Endpoint for verifying email
app.post('/set_prop_trans', async (req, res) => {
  try{
    var api_response = await set_prop_trans(req.body.email, req.body.password, req.body.value);
  }
  catch(err){
    console.log(err)
    res.send({'data': {}, 'message': 'Something went wrong', 'error': err.message}); // Return verification url from cpanel_verfiy_email function
  }
  res.send({'data': api_response.data, 'message': api_response.message ,'error': ''}); // Return verification url from cpanel_verfiy_email function
});

// Endpoint for verifying email
app.post('/export_csv', async (req, res) => {
  try{
    var api_response = await export_csv(req.body.email, req.body.password);
  }
  catch(err){
    console.log(err)
    res.send({'data': {}, 'message': 'Something went wrong', 'error': err.message}); // Return verification url from cpanel_verfiy_email function
  }
  res.send({'data': api_response.data, 'message': api_response.message, 'error': ''}); // Return verification url from cpanel_verfiy_email function
});

// Define route for downloading files
app.post('/download_csv', async (req, res) => {
  try {
    // Get the file path from the request body
    const { filePath } = req.body;

    // Verify the JWT token in the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, secretKey);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Create a readable stream from the file and pipe it to the HTTP response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Set the content-disposition header to force the browser to download the file
    const filename = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Delete the file after it has been sent to the client
    fileStream.on('close', () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending file' });
  }
});

// Start server on port 3000
// app.listen()
// module.exports = app;

app.listen(PORT, () => console.log(`API IS RUNNING ON PORT: ${PORT}`));