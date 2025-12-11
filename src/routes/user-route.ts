import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user-controller";
import { isAdminRoute, verifyToken } from "../middlewares/verify-token";

const router = require("express").Router();

//fetch all user
router.get("/", isAdminRoute, getUsers);

//fetch a single user profile
router.get("/user-profile", verifyToken, getUser);

//Update a user
router.put("/update-user", verifyToken, updateUser);

//Delete a user
router.delete("/delete-user", verifyToken, deleteUser);

export default router;
