export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
          
          <!-- Header with Logo and Social Icons -->
          <tr>
            <td style="padding-bottom: 30px; padding-top: 30px; padding-left: 10px; padding-right: 40px; border-bottom: 1px solid #e5e5e5;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="display: flex; align-items: center;">
                      <img src="https://res.cloudinary.com/dgfjxhoae/image/upload/v1765461163/monae/icon_txj1ag.png" alt="Monae Logo" style="height: 80px; width: auto; display: block;">
                      <h1 style="margin-left: -10px; margin-top: 24px;  font-size: 24px; font-weight: 700; color: #000000;">Monae</h1>
                  </td>
                  <td style="text-align: right;">
                    <a href="https://www.linkedin.com/" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/linkedin.png" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
                    <a href="https://x.com/home" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/twitter.png" alt="Twitter" style="width: 24px; height: 24px;"></a>
                    <a href="https://web.facebook.com/" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/facebook.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
                    <a href="https://www.instagram.com/" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h1 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: #000000; line-height: 1.2;">Verify Your Email</h1>
              <p style="margin: 0 0 25px 0; font-size: 16px; color: #000000; line-height: 1.6;">Hi {{name}},</p>
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #000000; line-height: 1.6;">Welcome to Monae. Before you continue, please verify your email so we can keep your account secure. Here's your Monae verification code:</p>
              
              <!-- Verification Code Boxes -->
              <table role="presentation" style="border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  {{codeBoxes}}
                </tr>
              </table>
              
              <p style="margin: 0 0 25px 0; font-size: 16px; color: #000000; line-height: 1.6;">Enter this code in the app to confirm your email and complete your sign-up. The code expires in <strong>15 minutes</strong>.</p>
              
              <p style="margin: 0 0 35px 0; font-size: 16px; color: #000000; line-height: 1.6;">If you didn't request this, you can ignore the email.</p>
              
              <!-- Copy Code Button -->
              <button style="display: inline-block; background-color: #5B6EF5; color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 8px; border: none; font-size: 16px; font-weight: 600; margin-bottom: 40px;">{{verificationCode}}</button>
              
              <p style="margin: 40px 0 5px 0; font-size: 16px; color: #000000; line-height: 1.6;">Thanks,</p>
              <p style="margin: 0 0 50px 0; font-size: 16px; font-weight: 700; color: #000000; line-height: 1.6;">The Monae Team</p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000; line-height: 1.6;">Monae at the touch of a button! Download our app for Google & APPLE.</p>
              
              <!-- App Store Buttons -->
              <table role="presentation" style="border-collapse: collapse; margin-bottom: 40px;">
                <tr>
                  <td style="padding-right: 15px;">
                      <img src="https://res.cloudinary.com/dgfjxhoae/image/upload/v1765621241/monae/Screenshot_2025-12-13_at_11.19.32_auifei.png" alt="Get it on Google Play" style="height: 30px; width: auto; display: block;">
                  </td>
                  <td>
                      <img src="https://res.cloudinary.com/dgfjxhoae/image/upload/v1765621241/monae/Screenshot_2025-12-13_at_11.20.06_f83fcn.png" alt="Download on the App Store" style="height: 30px; width: auto; display: block;">
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #000000; line-height: 1.6;">
                Questions or faq? Contact us at <a href="mailto:faq@monae.com" style="color: #5B6EF5; text-decoration: none;">faq@monae.com</a>. If you'd rather not receive this kind of email, Don't want any more emails from Monae? <a href="#" style="color: #5B6EF5; text-decoration: none;">Unsubscribe</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #ffffff; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #000000; line-height: 1.6;">100 Smith Street, Melbourne VIC 3000</p>
              <p style="margin: 0; font-size: 14px; color: #000000; line-height: 1.6;">© 2025 Monae</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
          
          <!-- Header with Logo and Social Icons -->
          <tr>
            <td style="padding-bottom: 30px; padding-top: 30px; padding-left: 10px; padding-right: 40px; border-bottom: 1px solid #e5e5e5;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="display: flex; align-items: center;">
                      <img src="https://res.cloudinary.com/dgfjxhoae/image/upload/v1765461163/monae/icon_txj1ag.png" alt="Monae Logo" style="height: 80px; width: auto; display: block;">
                      <h1 style="margin-left: -10px; margin-top: 24px;  font-size: 24px; font-weight: 700; color: #000000;">Monae</h1>
                  </td>
                  <td style="text-align: right;">
                    <a href="https://www.linkedin.com/" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/linkedin.png" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
                    <a href="https://x.com/home" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/twitter.png" alt="Twitter" style="width: 24px; height: 24px;"></a>
                    <a href="https://web.facebook.com/" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/facebook.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
                    <a href="https://www.instagram.com/" style="display: inline-block; margin-left: 15px;"><img src="https://img.icons8.com/ios-filled/50/6b7280/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h1 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: #000000; line-height: 1.2;">Welcome to Monae</h1>
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000; line-height: 1.6;">Hi {name},</p>
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000; line-height: 1.6;">You're all set to start tracking your spending, staying on top of your budgets, and getting AI-powered insights that help you make smarter financial decisions.</p>
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000; line-height: 1.6;">If you ever need help, Monae is right here to guide you.</p>
              <p style="margin: 0 0 40px 0; font-size: 16px; color: #000000; line-height: 1.6;">Let's build the future of your money together.</p>
              <p style="margin: 0 0 5px 0; font-size: 16px; color: #000000; line-height: 1.6;">Thanks,</p>
              <p style="margin: 0 0 50px 0; font-size: 16px; font-weight: 700; color: #000000; line-height: 1.6;">The Monae Team</p>
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #000000; line-height: 1.6;">Monae at the touch of a button! Download our app for Google & APPLE.</p>
              
              <!-- App Store Buttons -->
              <table role="presentation" style="border-collapse: collapse; margin-bottom: 40px;">
                <tr>
                  <td style="padding-right: 15px;">
                      <img src="https://res.cloudinary.com/dgfjxhoae/image/upload/v1765621241/monae/Screenshot_2025-12-13_at_11.19.32_auifei.png" alt="Get it on Google Play" style="height: 30px; width: auto; display: block;">
                  </td>
                  <td>
                      <img src="https://res.cloudinary.com/dgfjxhoae/image/upload/v1765621241/monae/Screenshot_2025-12-13_at_11.20.06_f83fcn.png" alt="Download on the App Store" style="height: 30px; width: auto; display: block;">
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #000000; line-height: 1.6;">
                Questions or faq? Contact us at <a href="mailto:faq@monae.com" style="color: #5B6EF5; text-decoration: none;">faq@monae.com</a>. If you'd rather not receive this kind of email, Don't want any more emails from Monae? <a href="#" style="color: #5B6EF5; text-decoration: none;">Unsubscribe</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #ffffff; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #000000; line-height: 1.6;">100 Smith Street, Melbourne VIC 3000</p>
              <p style="margin: 0; font-size: 14px; color: #000000; line-height: 1.6;">© 2025 Monae</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; padding:20px;">
  <h2>Password Reset Request</h2>

  <p>Hello {name},</p>
  <p>We received a request to reset your password.</p>

  <p>If you did not request this, ignore this message.</p>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; padding:20px;">
  <h2>Password Reset Successful</h2>

  <p>Hello {name},</p>
  <p>Your password has been successfully updated.</p>

  <p>If this was not you, please contact support immediately.</p>
</body>
</html>
`;

module.exports = {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
};
