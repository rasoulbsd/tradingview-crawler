const axios = require('axios');

const DOMAIN = 'anjomantalili.ir';
const API_TOKEN = 'IFCP0FLGOBISCYO659OW156184ZEFKJO';

async function makeRequest() {
  try {
    email_user = 'rasool'
    email_pass = '12345luggage'
    const response = await axios.get(`https://${DOMAIN}:2083/execute/Email/add_pop?email=${email_user}&password=${email_pass}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  // return response
}

(async () => {
  await makeRequest();
})()


// const cpanelEmail = require('cpanel-email');

// cpanelEmail.getEmailAccounts({
//   host: 'anjomantalili.ir',
//   accessKeyId: 'IFCP0FLGOBISCYO659OW156184ZEFKJO',
//   // accessKeySecret: 'your-api-secret'
// }, (err, accounts) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(accounts);
//   }
// });

// const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//   host: 'mail.anjomantalili.ir', // Replace with your cPanel mail server hostname
//   port: 465, // Port for secure SMTP (TLS/SSL)
//   secure: true, // Use SSL
//   auth: {
//     user: 'your-email-account@your-cpanel-domain.com',
//     pass: 'your-email-account-password'
//   }
// });

// let mailOptions = {
//   from: '"Sender Name" <sender@your-cpanel-domain.com>',
//   to: 'recipient@example.com',
//   subject: 'Test Email',
//   text: 'This is a test email from Node.js using Nodemailer!'
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

///////////////////

// const cpanel = require("cpanel-api");

// const DOMAIN = "anjomantalili.ir"

// const config = {
//   host: DOMAIN,
//   token: "IFCP0FLGOBISCYO659OW156184ZEFKJO",
// };

// // Connect to the cPanel API using an API token
// const client = new cpanel(config);

// // Get a list of email accounts
// client.api2(
//   "Email",
//   "list_pops",
//   {
//     api_version: 2,
//   },
//   (err, response) => {
//     if (err) throw err;

//     // Loop over each email account and fetch the messages
//     response.cpanelresult.data.forEach((account) => {
//       const email = account.email;
      
//       // Fetch the messages in the mailbox
//       client.api2(
//         "Email",
//         "list_mailbox",
//         {
//           api_version: 2,
//           domain: DOMAIN,
//           email,
//         },
//         (err, messages) => {
//           if (err) throw err;

//           // Loop over each message and log its subject
//           messages.cpanelresult.data.forEach((message) => {
//             console.log(message.subject);
//           });
//         }
//       );
//     });
//   }
// );
