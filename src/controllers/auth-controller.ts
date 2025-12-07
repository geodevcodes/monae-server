import asyncHandler from "express-async-handler";
import User from "../models/user-model";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

// Google Oauth Login
export const googleLoginUser = asyncHandler(async (req, res: any) => {
  const { email, name, picture, googleId } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email  is required" });
  }

  if (!googleId) {
    return res.status(400).json({ message: "Google ID is required" });
  }

  try {
    let user = await User.findOne({ email });

    // If user doesn't exist, create them
    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        avatarImage: picture,
        googleId,
        role: "User",
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY is missing in environment variables.");
    }
    // Generate JWT token after ensuring user exists
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Google login successful",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatarImage: user.avatarImage,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error("Google login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Github Auth Login
export const githubLoginUser = asyncHandler(async (req, res: any) => {
  const { email, name, picture, githubId } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!githubId) {
    return res.status(400).json({ message: "GitHub ID is required" });
  }

  try {
    let user = await User.findOne({
      $or: [{ email }, { githubId }],
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        avatarImage: picture,
        githubId,
        role: "User",
      });
    } else if (!user.githubId) {
      // Update existing user with GitHub ID
      user.githubId = githubId;
      await user.save();
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY is missing in environment variables.");
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "GitHub login successful",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatarImage: user.avatarImage,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error("GitHub login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
