import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("error", (e) => {
    console.error("Mongo connection error:", e.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("Mongo disconnected");
  });

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  console.log("✅ MongoDB connected:", mongoose.connection.host);
}
