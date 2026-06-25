import mongoose from "mongoose";

// SCHEMA DEFINITION:
// A Mongoose schema acts as a blueprint, defining the structure, types, and constraints of our documents in MongoDB.
const doubtSchema = new mongoose.Schema(
  {
    // The name of the student submitting the doubt
    studentName: {
      type: String,
      required: true,      // Database field cannot be empty
      trim: true,          // Automatically removes trailing and leading white spaces
      maxlength: 60        // Limits the name length to prevent database abuse
    },
    // The subject of the doubt, restricted to specific options (enum)
    topic: {
      type: String,
      required: true,
      // Validator ensuring only these exact strings are valid topics
      enum: ["React", "Node", "Express", "MongoDB", "Mongoose", "Integration"]
    },
    // The question/doubt description
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    // Status flag indicating whether the doubt is resolved
    isSolved: {
      type: Boolean,
      default: false       // Defaults to false (Pending) when a new doubt is submitted
    }
  },
  {
    // Automatically creates and maintains "createdAt" and "updatedAt" timestamps
    timestamps: true
  }
);

// MODEL DEFINITION:
// A model compiles the schema into an object. We can perform CRUD operations on the DB through this model object.
const Doubt = mongoose.model("Doubt", doubtSchema);

export default Doubt;
