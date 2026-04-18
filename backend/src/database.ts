import { AppDataSource } from "./data-source";

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};