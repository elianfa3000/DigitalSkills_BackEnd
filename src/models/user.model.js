import mongoose from "mongoose";

const userScheme = mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    level: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userScheme);
