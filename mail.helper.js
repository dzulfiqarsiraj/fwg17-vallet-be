const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const GMAIL_EMAIL_ADDRESS = process.env.GMAIL_EMAIL_ADDRESS;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN
const GMAIL_CALLBACK_URI = process.env.GMAIL_CALLBACK_URI;

const oauth2Client = new OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_CALLBACK_URI
);

oauth2Client.setCredentials({
    refresh_token: GMAIL_REFRESH_TOKEN
});


const transport = async () => {
    const accessToken = await oauth2Client.getAccessToken();
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_EMAIL_ADDRESS,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    
  };
  
  module.exports = transport