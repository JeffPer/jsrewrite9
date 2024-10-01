// server.js

const express = require('express');
const path = require('path');
const session = require('express-session'); // Add this line
require('dotenv').config();

const app = express();

// Configure session middleware
app.use(
  session({
    secret: 'handtagaristokraikolavippen', // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const transcribeRouter = require('./transcription');
const chatRouter = require('./LLMtalker');
const ttsRouter = require('./tts');

// Use routes
app.use('/transcribe', transcribeRouter);
app.use('/chat', chatRouter);
app.use('/tts', ttsRouter);

// Endpoint to get conversation history
app.get('/conversation', (req, res) => {
  try {
    const conversationHistory = req.session.conversationHistory || [];
    res.json({ conversationHistory });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
