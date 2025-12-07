import winston from "winston";
import fs from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

// Use /tmp in production (serverless), local logs in dev
const logDir = isProduction ? "/tmp/logs" : path.join(process.cwd(), "logs");

// Ensure directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
      handleExceptions: true,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
  exitOnError: false,
});

export default logger;
