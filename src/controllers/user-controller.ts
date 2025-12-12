import User from "../models/user-model";
import asyncHandler from "express-async-handler";

// -------------------- GET ALL USERS --------------------
export const getUsers = asyncHandler(async (req: any, res: any) => {
  const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (pageNumber - 1) * limit;

  const { search } = req.query;
  let filter: any = {};

  if (search) {
    filter = {
      $or: [
        { email: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ],
    };
  }

  const totalUsers = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const endCursor = skip + users.length;
  const hasNextPage = endCursor < totalUsers;

  const meta = {
    totalUsers,
    totalItems: totalUsers,
    limit,
    pageNumber,
    totalPages: Math.ceil(totalUsers / limit),
    hasNextPage,
    endCursor,
  };

  res.status(200).json({
    success: true,
    message: "Users Fetched Successfully",
    meta,
    data: users,
  });
});

// -------------------- GET USER PROFILE --------------------
export const getUser = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User Fetched Successfully",
    data: user,
  });
});

// -------------------- UPDATE USER --------------------
export const updateUser = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error(`Cannot find user with ID ${userId}`);
  }

  const data = { ...req.body };

  const updatedUser = await User.findByIdAndUpdate(userId, data, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    data: updatedUser,
  });
});

// -------------------- DELETE USER --------------------
export const deleteUser = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error(`Cannot find any user with ID ${userId}`);
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
    data: [],
  });
});
