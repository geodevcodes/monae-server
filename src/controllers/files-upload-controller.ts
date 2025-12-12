import User from "../models/user-model";
import asyncHandler from "express-async-handler";
import { cloudinary } from "../middlewares/cloudinary";

// Upload a Single File
export const fileUpload = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const file = req.file?.path;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      upload_preset: "monae-files",
    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filePublicId: uploadResult.public_id,
        fileUrl: uploadResult.secure_url,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Upload multiple user files
export const filesUpload = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
