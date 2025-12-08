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
