const nodemailer = require("nodemailer");

const sendMail = () => {
  // For Ordinary Gmail account
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use 465 for SSL or 587 for TLS
    secure: true, // Set to true if using port 465 (SSL)
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  return transporter;
};

module.exports = { sendMail };
