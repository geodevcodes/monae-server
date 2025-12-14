import mongoose from "mongoose";

const monoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monoAccountId: {
      type: String,
      required: true,
      unique: true,
    },
    monoCustomerId: {
      type: String,
      default: null,
    },
    institution: {
      type: String,
      default: "",
    },
    bankCode: {
      type: String,
      default: "",
    },
    accountName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    balance: {
      type: Number,
      default: 0,
    },
    accountType: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "NGN",
    },
  },
  {
    timestamps: true,
  }
);

const MonoModel = mongoose.model("MonoAccount", monoSchema);

export default MonoModel;
