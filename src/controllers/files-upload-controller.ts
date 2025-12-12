import User from "../models/user-model";
import asyncHandler from "express-async-handler";
import { cloudinary } from "../middlewares/cloudinary";

// -------------------- UPLOAD SINGLE FILE --------------------
export const fileUpload = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const file = req.file?.path;
  if (!file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const uploadResult = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    upload_preset: "monae",
  });

  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      filePublicId: uploadResult.public_id,
      fileUrl: uploadResult.secure_url,
    },
  });
});

// -------------------- UPLOAD MULTIPLE FILES --------------------
export const filesUpload = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400);
    throw new Error("No files uploaded");
  }

  // Upload each file to Cloudinary
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        upload_preset: "monae",
      });
      return {
        filesPublicId: result.public_id,
        filesUrl: result.secure_url,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    data: uploadedFiles,
  });
});
