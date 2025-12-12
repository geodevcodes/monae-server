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
  try {
    const { email, password, role } = req.body;

    const checkEmail = await User.findOne({ email });
    if (checkEmail)
      return res.status(401).json({ message: "Email already exists" });

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      10000 + Math.random() * 90000
    ).toString(); // 5-digit code

    const newUser = await User.create({
      email,
      role,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      isVerified: false,
    });

    await sendVerificationEmail(email, `Monae`, verificationToken);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      data: { email: newUser.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- VERIFY EMAIL --------------------
export const verifyEmail = asyncHandler(async (req: any, res: any) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, `Monae`);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- RESEND VERIFICATION --------------------
export const resendVerificationOTP = asyncHandler(
  async (req: any, res: any) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User is already verified",
        });
      }

      const newVerificationToken = Math.floor(
        10000 + Math.random() * 90000
      ).toString();

      user.verificationToken = newVerificationToken;
      user.verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      // Send the new OTP to the user's email
      await sendVerificationEmail(user.email, `Monae`, newVerificationToken);

      return res.status(200).json({
        success: true,
        message: `New verification code sent to ${email}`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// -------------------- LOGIN --------------------
export const loginUser = asyncHandler(async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(401).json({ error: "Verify your email to continue" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
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
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = asyncHandler(async (req: any, res: any) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // send email
    await sendPasswordResetEmail(user.email, `Monae`);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent",
      token: resetToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- RESET PASSWORD --------------------
export const resetPassword = asyncHandler(async (req: any, res: any) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email, `Monae`);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- GOOGLE LOGIN --------------------
export const googleLoginUser = asyncHandler(async (req: any, res: any) => {
  const { email, lastName, picture, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        lastName,
        email,
        avatarImage: picture,
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

    return res.status(200).json({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const refreshAccessToken = asyncHandler(async (req: any, res: any) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token required" });
  }

  try {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
});

export const logoutUser = asyncHandler(async (req: any, res: any) => {
  try {
    req.session = null;

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});
