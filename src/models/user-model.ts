const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    githubId: String,
    fullName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      sparse: true,
    },
    avatarImage: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
