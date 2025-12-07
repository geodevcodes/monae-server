import User from "../models/user-model";
import asyncHandler from "express-async-handler";

// get all Users
export const getUsers = asyncHandler(async (req: any, res: any) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (pageNumber - 1) * limit;

    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const totalUsers = await User.countDocuments();
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalItems = await User.countDocuments();
    const endCursor = skip + users.length;
    const hasNextPage = endCursor < totalItems;


    const meta = {
      totalUsers,
      totalItems,
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
  } catch (error: any) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a single User
export const getUser = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a User Profile
export const getUserProfile = asyncHandler(async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error(error.message);
  }
});

//  Update a User
export const updateUser = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error(`Cannot find user with ID ${id}`);
    }

    const data = { ...req.body };

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//  delete a User
export const deleteUser = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      throw new Error(`cannot find any user with ID ${id}`);
    }
    // Delete the user from the database
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      data: [],
    });
  } catch (error: any) {
    res.status(500);
    throw new Error(error.message);
  }
});
