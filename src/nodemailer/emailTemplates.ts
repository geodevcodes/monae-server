export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; padding:20px;">
  <h2>Email Verification</h2>
  <p>Hello {name},</p>
  <p>Please use the verification code below to verify your email:</p>
  <h1 style="letter-spacing:5px; font-size:32px;">{verificationCode}</h1>
  <p>This code expires in 15 minutes.</p>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; padding:20px;">
  <h2>Welcome!</h2>
  <p>Hello {name},</p>
  <p>Your account has been created successfully.</p>
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
