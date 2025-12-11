// import nodemailer, { Transporter } from "nodemailer";
import nodemailer, { Transporter } from "nodemailer";

export const sendMail = (): Transporter => {
  // For Ordinary Gmail account
  const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // SSL
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter;
};


export const createTransporter = (): Transporter => {
  const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // 465 for SSL
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
    // optional timeouts:
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  return transporter;
};
