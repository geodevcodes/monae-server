import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Multer config
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return cb(new Error("Unsupported file type!"));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

export default upload;
