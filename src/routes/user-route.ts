import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user-controller";

const router = require("express").Router();

//fetch all user
router.get("/", getUsers);

//fetch a single user
router.get("/:id", getUser);

//Update a user
router.put("/:id", updateUser);

//Delete a user
router.delete("/:id", deleteUser);

export default router;
