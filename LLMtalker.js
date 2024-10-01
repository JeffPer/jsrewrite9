// LLMtalker.js

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI();

router.post('/', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Initialize conversation history in session if not present
    if (!req.session.conversationHistory) {
      req.session.conversationHistory = [
        { role: 'system', content: 'You are a helpful assistant.' },
      ];
    }

    // Add user's message to the conversation history
    req.session.conversationHistory.push({ role: 'user', content: userMessage });

    // Call OpenAI API with the conversation history
    const completion = await openai.chat.completions.create({
      messages: req.session.conversationHistory,
      model: 'gpt-4o', // Replace with 'gpt-3.5-turbo' if necessary
    });

    const assistantMessage = completion.choices[0].message.content;

    // Add assistant's response to the conversation history
    req.session.conversationHistory.push({ role: 'assistant', content: assistantMessage });

    res.json({ assistantMessage });
  } catch (error) {
    console.error('Chat Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get assistant response' });
  }
});

module.exports = router;
