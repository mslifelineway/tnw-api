import mongoose from "mongoose";

const connectDatabase = async () => {
  const connectionString = process.env.DATABASE;
  if (connectionString) {
    await mongoose
      .connect(connectionString)
      .then(() => console.log("==> Aaw! Database connected! 🔥🌟"));
  }
};

connectDatabase();
