import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates";
import { generateCodeBoxes } from "./generateCodeBoxes";
import { createTransporter } from "./sendMail";

// ===================== VERIFICATION EMAIL =====================
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationCode: string
): Promise<void> => {
  const recipient = email;

  const emailBody = VERIFICATION_EMAIL_TEMPLATE.replace("{{name}}", name)
    .replace("{{verificationCode}}", verificationCode)
    .replace("{{codeBoxes}}", generateCodeBoxes(verificationCode));

  const transporter = createTransporter();

  try {
    // verify connection/configuration first — helps capture connection/auth errors
    await transporter.verify();
    console.log("SMTP verify successful (can connect to SMTP server)");

    const mailOptions = {
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Confirm Your Monae Account",
      html: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification Email sent successfully:", info);
  } catch (err) {
    // log full error so Vercel logs show it
    console.error("Failed to send verification email:", err);
    // rethrow so your function returns 500 and you can see the stack/err in logs
    throw err;
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
    ).replace("{name}", email);

    const transporter = createTransporter();
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Welcome To Monae",
      html: emailBody,
    });

    console.log("Welcome email sent:", info);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
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

    const transporter = createTransporter();
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Reset Your Password",
      html: emailBody,
    });

    console.log("Password reset email sent successfully:", info);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
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

    const transporter = createTransporter();
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Monae" <${process.env.MAIL_EMAIL}>`,
      to: recipient,
      subject: "Password Reset Successful",
      html: emailBody,
    });

    console.log("Password reset success email sent:", info);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw error;
  }
};
