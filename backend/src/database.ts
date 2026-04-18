import { AppDataSource } from "./dataSource";

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};
