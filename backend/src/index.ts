import { app } from "./app";
import { connectDB } from "./database";

const start = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
};

start();
