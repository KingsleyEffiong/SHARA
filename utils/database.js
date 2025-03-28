import mongoose from "mongoose";
import { NODE_ENV, DB_URI } from "@/config/env";

const connectToDB = async () => {
  if (!DB_URI)
    throw new Error("Database URI not set in the environmental variable file");

  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to database via ${NODE_ENV}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectToDB;
