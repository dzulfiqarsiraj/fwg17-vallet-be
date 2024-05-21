const nodemailer = require('nodemailer');

const transporter = async () => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
  };
  
  module.exports = transporter