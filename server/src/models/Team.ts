import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
        "Athletics (100 or 200 meter)",
        "Cricket"
      ],
    },
    department: {
      type: String,
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DepartmentPlayer",
      }
    ],
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
    // coach: String, // Removed coach, use captain only
    imageUrl: String,
  },
  { timestamps: true }
);

export const Team = mongoose.model("Team", teamSchema);
