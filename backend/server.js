import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT} 🚀`);
  });
});
// Nodemon reloaded for auth update


