import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import dbConnection from "./config/db";

const PORT = process.env.PORT || 5000;

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("❌ Database connection failed:", error);
  process.exit(1);
});
