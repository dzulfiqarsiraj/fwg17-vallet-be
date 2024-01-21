const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const GMAIL_EMAIL_ADDRESS = 'vallet.digital.app@gmail.com'; // masukkan email yang digunakan pada GCC
const GMAIL_CLIENT_ID = '1012811543894-96tadh19tare80oul5s2cc6f8taq0b7m.apps.googleusercontent.com'; // masukkan client id disini
const GMAIL_CLIENT_SECRET = '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'; // masukkan client secret disini
const GMAIL_REFRESH_TOKEN = '1//04UhEawfvBZfJCgYIARAAGAQSNwF-L9Irh40BhFoki4dgP3MLMmYR-BUlkuNxfkLzlZorbeOCcj4FuJrJCE7RXl7XhssVEyoL10w'; // masukkan refresh token disini
const GMAIL_CALLBACK_URI = 'https://developers.google.com/oauthplayground';

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