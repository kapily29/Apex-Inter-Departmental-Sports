import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin", "super_admin"],
    },
    profileImage: {
      type: String,
      default: null,
    },
    firstName: String,
    lastName: String,
    phone: String,
    bio: String,
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
