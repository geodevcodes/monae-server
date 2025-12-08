import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates";
import { sendMail } from "./sendMail";
import { SentMessageInfo, Transporter } from "nodemailer";

// ===================== VERIFICATION EMAIL =====================
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
): Promise<void> => {
  const recipient = email;

  try {
    const emailBody = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ).replace("{name}", name);

    const transporter: Transporter = sendMail();

    const mailOptions = {
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Confirm Your Monae Account",
      html: emailBody,
      text: `Hello ${name}, 
Thank you for creating your Monae account. To complete your registration, please use this verification code: ${verificationToken}

This code will expire in 15 minutes.

Best regards,
The Monae Team`,
    };

    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Verification Email sent successfully");
          console.log(info);
        }
      }
    );
  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

// ===================== WELCOME EMAIL =====================
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const recipient = email;

  try {
    const emailBody = WELCOME_EMAIL_TEMPLATE.replace(
      "{userEmail}",
      email
    ).replace("{name}", name);

    const transporter: Transporter = sendMail();

    const mailOptions = {
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Welcome To Monae",
      html: emailBody,
    };

    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.log(error);
        } else {
          console.log(info);
        }
      }
    );
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

// ===================== PASSWORD RESET EMAIL =====================
export const sendPasswordResetEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const recipient = email;

  try {
    const emailBody = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{name}", name);

    const transporter: Transporter = sendMail();

    const mailOptions = {
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Reset your password",
      html: emailBody,
    };

    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Password reset mail sent successfully");
          console.log(info);
        }
      }
    );
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

// ===================== PASSWORD RESET SUCCESS EMAIL =====================
export const sendResetSuccessEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const recipient = email;

  try {
    const emailBody = PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}", name);

    const transporter: Transporter = sendMail();

    const mailOptions = {
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Password Reset Successful",
      html: emailBody,
    };

    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Password reset success email sent");
          console.log(info);
        }
      }
    );
  } catch (error) {
    console.error(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
