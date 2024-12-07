import mongoose from "mongoose";
// import dotenv form "dotenv"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {}
};

export default connectDB;
