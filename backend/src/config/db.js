import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js SRV DNS lookup issues using Cloudflare & Google DNS
try {
  dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8"]);
} catch (e) {
  // fallback if custom DNS set fail
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ✅ — ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
