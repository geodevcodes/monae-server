import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: string;
  userRole?: string;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const secretKey = process.env.SECRET_KEY;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided",
    });
  }

  if (!secretKey) {
    console.error("SECRET_KEY is missing");
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

const isAdminRoute = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const secretKey = process.env.SECRET_KEY;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized as admin. No token provided.",
    });
  }

  if (!secretKey) {
    console.error("SECRET_KEY is missing");
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

export default { verifyToken, isAdminRoute };
