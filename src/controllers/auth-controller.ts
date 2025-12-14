import asyncHandler from "express-async-handler";
import User from "../models/user-model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../nodemailer/emails");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// -------------------- REGISTER USER --------------------
export const createUser = asyncHandler(async (req: any, res: any) => {
  const { email, password, role } = req.body;

  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    res.status(401);
    throw new Error("Email already exists");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = Math.floor(
    10000 + Math.random() * 90000
  ).toString();

  const newUser = await User.create({
    email,
    role,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    isVerified: false,
  });

  await sendVerificationEmail(email, `Monae`, verificationToken);

  res.status(200).json({
    success: true,
    message: "Verification code sent to your email",
    data: { email: newUser.email },
  });
});

// -------------------- VERIFY EMAIL --------------------
export const verifyEmail = asyncHandler(async (req: any, res: any) => {
  const { code } = req.body;

  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  await sendWelcomeEmail(user.email, "Monae");

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

// -------------------- RESEND VERIFICATION --------------------
export const resendVerificationOTP = asyncHandler(
  async (req: any, res: any) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error("User is already verified");
    }

    const newVerificationToken = Math.floor(
      10000 + Math.random() * 90000
    ).toString();

    user.verificationToken = newVerificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, "Monae", newVerificationToken);

    res.status(200).json({
      success: true,
      message: `New verification code sent to ${email}`,
    });
  }
);

// -------------------- LOGIN --------------------
export const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    // Generate a new verification token
    const newVerificationToken = Math.floor(
      10000 + Math.random() * 90000
    ).toString();
    user.verificationToken = newVerificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, "Monae", newVerificationToken);

    res.status(401).json({
      success: false,
      message:
        "Verify your email to continue. A new verification code has been sent to your email.",
    });
    return;
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  if (!user.password) {
    res.status(401);
    throw new Error(
      "This account uses Google sign-in. Please sign in with Google."
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  await sendPasswordResetEmail(user.email, "Monae");

  res.status(200).json({
    success: true,
    message: "Password reset link sent",
    token: resetToken,
  });
});

// -------------------- RESET PASSWORD --------------------
export const resetPassword = asyncHandler(async (req: any, res: any) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  await sendResetSuccessEmail(user.email, "Monae");

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

// -------------------- GOOGLE LOGIN --------------------
export const googleLoginUser = asyncHandler(async (req: any, res: any) => {
  const { email, firstName, lastName, avatarImage, googleId } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      firstName,
      lastName,
      email,
      avatarImage,
      googleId,
      isVerified: true,
    });
  } else if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    success: true,
    message: "Google login successful",
    data: {
      _id: user._id,
      lastName: user.lastName,
      email: user.email,
      avatarImage: user.avatarImage,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

// -------------------- REFRESH ACCESS TOKEN --------------------
export const refreshAccessToken = asyncHandler(async (req: any, res: any) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh token required");
  }

  const decoded: any = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  const newAccessToken = jwt.sign(
    { userId: decoded.userId },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

// -------------------- LOGOUT --------------------
export const logoutUser = asyncHandler(async (req: any, res: any) => {
  req.session = null;
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
