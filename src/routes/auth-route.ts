const router = require("express").Router();
import {
  googleLoginUser,
  createUser,
  verifyEmail,
  resendVerificationOTP,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth-controller";

// auth Register (Signup)
router.post("/register", createUser);

// auth Verify Email
router.post("/verify-email", verifyEmail);

router.post("/resend-verification", resendVerificationOTP);

// auth login
router.post("/login", loginUser);

// auth forgot password
router.post("/forgot-password", forgotPassword);

// auth reset password
router.post("/reset-password/:token", resetPassword);

// google auth login
router.post("/google-login", googleLoginUser);

export default router;
