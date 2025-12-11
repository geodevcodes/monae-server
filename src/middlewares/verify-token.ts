import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const rawToken =
    req.headers?.authorization?.split(" ")[1] || req.headers["x-access-token"];
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const secretKey = process.env.ACCESS_TOKEN_SECRET;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided",
    });
  }

  if (!secretKey) {
    console.error("ACCESS_TOKEN_SECRET is missing");
    return res.status(500).json({ success: false, message: "Server error" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    if (typeof decoded === "string") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.log("Error in verifyToken:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const isAdminRoute = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const secretKey = process.env.ACCESS_TOKEN_SECRET;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized as admin. No token provided.",
    });
  }

  if (!secretKey) {
    console.error("ACCESS_TOKEN_SECRET is missing");
    return res.status(500).json({ success: false, message: "Server error" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    if (typeof decoded === "string") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (decoded.role === "Admin") {
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized as admin. Try login as admin.",
      });
    }
  } catch (error) {
    console.error("Error in isAdminRoute:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token. Authentication failed.",
    });
  }
};

