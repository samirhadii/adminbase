//use a .env file that stores EMAIL, REFRESH_TOKEN, CLIENT_SECRET, CLIENT_ID
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });
  return transporter;
};

//list of all emails registered for promotions from the database 
//change this later to actually pull from emails in database
var mailinglist = [
    "samirhadi929@gmail.com",
    "thattdude001@gmail.com"
]
const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};
//actual contents of email here 
sendEmail({
  subject: "New Promotion from Watchdawgs Cinema!",
  to: mailinglist,
  from: process.env.EMAIL,
  //text: "I am sending an email from nodemailer!"
  html:'<h1>Try this new promo code!</h1><p>Try out this new code at checkout!</p>'

});