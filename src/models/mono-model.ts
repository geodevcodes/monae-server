import mongoose from "mongoose";

const monoSchema = new mongoose.Schema(
  {
    monoAccountId: {
      type: String,
      required: true,
      unique: true,
    },
    monoCustomerId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    institution: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const MonoModel = mongoose.model("MonoAccount", monoSchema);

export default MonoModel;
