import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Nil"],
      default: "Nil",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password is required only if googleId and githubId is not present
      },
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
      required: false,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // skip validation if no value is provided
          return /^(\+?\d{1,4}[-.\s]?)?(\d{10,12})$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    avatarImage: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },

    // PERSONALISATION OBJECT
    personalisation: {
      language: {
        type: String,
        default: "en",
      },
      screenMode: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },

    //  SECURITY OBJECT
    security: {
      biometric: {
        type: Boolean,
        default: false,
      },
      passcode: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

export default User;
