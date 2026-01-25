import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    rNumber: {
      type: String,
      required: true,
      unique: true,
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    department: {
      type: String,
      enum: [
        "Computer Science",
        "Information Technology",
        "Electronics",
        "Mechanical",
        "Civil",
        "Electrical",
        "Chemical",
        "Biotechnology",
        "MBA",
        "MCA",
        "Other",
      ],
      required: true,
    },
    position: String,
    number: Number,
    joinDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Player = mongoose.model("Player", playerSchema);
