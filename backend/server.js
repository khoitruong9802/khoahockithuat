// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri);
// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("MongoDB database connection established successfully");
// });

// const usersRouter = require("./routes/users");
// const questionsRouter = require("./routes/questions");
// const testsRouter = require("./routes/tests");

// app.use("/users", usersRouter);
// app.use("/questions", questionsRouter);
// app.use("/tests", testsRouter);

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

// server.js
import express from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware for parsing JSON request bodies
app.use(express.json());

// Initialize the Gemini Client
// It automatically picks up the GEMINI_API_KEY from the environment
const ai = new GoogleGenAI({});

// In-memory storage for chat sessions.
// In a real app, you would use a database (like MongoDB or PostgreSQL).
const chatSessions = new Map();

// --- API Route to Handle Chat Messages ---
app.post("/api/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).send({ error: "Message is required" });
  }

  // 1. Manage Chat History (Session)
  let session = chatSessions.get(sessionId);

  // If no session exists, create a new one using the Gemini SDK's chat service
  if (!session) {
    session = ai.chats.create({
      model: "gemini-2.5-flash", // Use a suitable model for chat
      config: {
        // Optional: Provide a System Instruction to define the chatbot's persona
        systemInstruction:
          "You are a helpful and friendly chatbot assistant. Keep your answers concise and informative.",
      },
    });

    // Use a unique ID (UUID) for a new session
    const newSessionId = sessionId || uuidv4();
    chatSessions.set(newSessionId, session);
    req.body.sessionId = newSessionId; // Update the ID for the response
  }

  try {
    // 2. Send Message and Get Response
    // The chat object automatically includes the history in the call to Gemini
    const response = await session.sendMessage({ message });

    // 3. Send the Response back to the client
    res.json({
      reply: response.text,
      sessionId: req.body.sessionId,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).send({ error: "Failed to get response from AI." });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
