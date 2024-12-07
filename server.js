import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authroute from "./Routes/authroute.js";
import categoryRoute from "./Routes/categoryroutes.js";
import producRoute from "./Routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Environment Configuration
dotenv.config();

// Database Connection
connectDB();

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Fix for __dirname in ES Module Scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Files
app.use(express.static(path.join(__dirname, "./client/build")));

// Routes
app.use("/api/v1/auth", authroute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", producRoute);

// Catch-all Handler for SPA
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Port Configuration
const PORT = process.env.PORT || 8080;

// Start Server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
