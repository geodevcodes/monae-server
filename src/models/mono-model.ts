import mongoose from "mongoose";

const monoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    monoAccountId: { type: String, required: true, unique: true },
    institution: { type: String, required: false },
  },
  { timestamps: true }
);

const MonoModel = mongoose.model("MonoAccount", monoSchema);

export default MonoModel;
