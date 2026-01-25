import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sport: {
      type: String,
      required: true,
      enum: [
        "Football",
        "Volleyball",
        "Basketball",
        "Kabaddi",
        "Badminton",
        "Chess",
        "Kho Kho",
        "Table Tennis",
        "Tug of War",
        "Sack Race",
      ],
    },
    department: {
      type: String,
      required: true,
      enum: [
        "",
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
    record: {
      type: String,
      default: "0-0",
    },
    wins: {
      type: String,
      default: "0",
    },
    standings: {
      type: String,
      default: "N/A",
    },
    description: String,
    coach: String,
    imageUrl: String,
  },
  { timestamps: true }
);

export const Team = mongoose.model("Team", teamSchema);
