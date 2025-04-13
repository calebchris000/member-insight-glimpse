import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const mongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("MongoDB service active.");
  } catch (error) {
    console.log("Failed to initialize mongodb service");
  }
};
