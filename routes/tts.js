// routes/tts.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.get('/', async (req, res) => {
  try {
    const text = req.query.text;
    if (!text) {
      return res.status(400).send('No text provided for TTS.');
    }

    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy', // Adjust the voice parameter if needed
      input: text,
    });

    // OpenAI SDK may return a stream or a buffer; adjust accordingly
    const mp3Buffer = Buffer.from(await mp3Response.arrayBuffer());

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': mp3Buffer.length,
    });
    res.send(mp3Buffer);
  } catch (error) {
    console.error('Error generating TTS:', error);
    res.status(500).send('Error generating TTS');
  }
});

module.exports = router;
