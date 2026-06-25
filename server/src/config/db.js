import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI; // this will directly access the URL

    if (!mongoUri) {
      throw new Error("Mongo_URI is missing from .env");
    }

    const connection = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected : ${connection.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1)
  }
}


// mongoose.connect()- it returns a promise whether the connection is successful or not
// try catch() - always use a error managment use calling the database connection function
//process.exit-   kills the server if DB is unreachable or not getting connected
