import {
  filesUpload,
  fileUpload,
} from "../controllers/files-upload-controller";
import upload from "../middlewares/multer";
import { verifyToken } from "../middlewares/verify-token";

const router = require("express").Router();

// Upload a single file
router.post("/", verifyToken, upload.single("file"), fileUpload);

// Upload multiple files
router.post("/", verifyToken, upload.array("files"), filesUpload);

export default router;
