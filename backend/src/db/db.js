import mongoose from "mongoose";

async function connectToDB() {
  const uri = process.env.MONGODB_ATLAS_URL;

  if (!uri) {
    console.error(
      "❌ MongoDB connection error: MONGODB_ATLAS_URL is not defined in .env",
    );
    return;
  }

  mongoose
    .connect(uri)
    .then(() => {
      console.log("✅ MongoDB connected");
    })
    .catch((err) => {
      console.log("❌ MongoDB connection error", err);
    });
}

export default connectToDB;
