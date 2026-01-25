import mongoose from "mongoose";

const announceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "medium", "high", "urgent"],
      default: "normal",
    },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", announceSchema);
