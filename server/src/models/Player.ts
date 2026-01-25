import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      default: "active",
    },
  },
  { timestamps: true }
);

export const Player = mongoose.model("Player", playerSchema);
