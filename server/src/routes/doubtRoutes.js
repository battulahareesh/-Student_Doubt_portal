import express from "express";
import Doubt from "../models/Doubt.js";

// Create an instance of Express Router to bundle route paths together
const router = express.Router();

// 1. GET ROUTE: Fetch all doubt entries from MongoDB
// Path: GET /api/doubts
router.get("/", async (req, res) => {
  try {
    // Mongoose find() retrieves all records, sort({ createdAt: -1 }) brings newest first
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.json(doubts); // Return results as a JSON array
  } catch (error) {
    // Return an HTTP status code 500 (Internal Server Error) if something breaks
    res.status(500).json({ message: "Could not fetch doubts" });
  }
});

// 2. POST ROUTE: Insert a new doubt into the database
// Path: POST /api/doubts
router.post("/", async (req, res) => {
  try {
    // Extract the submitted data fields from req.body (parsed by express.json() in server.js)
    const { studentName, topic, question } = req.body;

    // Create and save the new document using our Mongoose model
    const newDoubt = await Doubt.create({
      studentName,
      topic,
      question
    });

    // Return the newly created record along with HTTP status 201 (Created)
    res.status(201).json(newDoubt);
  } catch (error) {
    // Return HTTP status 400 (Bad Request) if database validation rules fail (e.g. invalid topic)
    res.status(400).json({
      message: "Could not create doubt",
      error: error.message
    });
  }
});

// 3. PATCH ROUTE: Toggle the "solved" status of a specific doubt
// Path: PATCH /api/doubts/:id/toggle-solved
router.patch("/:id/toggle-solved", async (req, res) => {
  try {
    
    const doubt = await Doubt.findById(req.params.id);

    
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

   
    doubt.isSolved = !doubt.isSolved;
    
    
    await doubt.save();

    res.json(doubt);
  } catch (error) {
    res.status(400).json({ message: "Could not update doubt" });
  }
});

// 4. DELETE ROUTE: Delete a doubt entry
// Path: DELETE /api/doubts/:id
router.delete("/:id", async (req, res) => {
  try {
    // Find a document by its ID and delete it in one action
    const deletedDoubt = await Doubt.findByIdAndDelete(req.params.id);

    if (!deletedDoubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json({ message: "Doubt deleted" });
  } catch (error) {
    res.status(400).json({ message: "Could not delete doubt" });
  }
});

export default router;
