import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import doubtRoutes from "./routes/doubtRoutes.js";

// Load environment variables from the server/.env file into process.env
dotenv.config();

// Initialize the Express application
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE: Enable CORS so clients from other origins/ports can make requests to our server
app.use(cors());

// MIDDLEWARE: Allow Express to read and parse JSON request bodies (essential for POST/PUT requests)
app.use(express.json());

// API Status Route: Simple endpoint to verify the server is up and running
app.get("/", (req, res) => {
  res.json({ message: "Student Doubt Board API is running" });
});

// ROUTING: Mount the doubt routes under the "/api/doubts" path prefix
app.use("/api/doubts", doubtRoutes);

// Database-First Boot: Connect to MongoDB first. Once successful, start listening for API requests.
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
