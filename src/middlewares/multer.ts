import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path"

// Multer config
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp" && ext !== ".pdf") {
       cb(new Error("Unsupported file type!"));
      return;
    }
    cb(null, true);
  },
});

export default upload;
