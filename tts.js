// tts.js

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI();

router.get('/', async (req, res) => {
  try {
    const text = req.query.text;
    if (!text) {
      return res.status(400).send('No text provided for TTS.');
    }

    // Replace with the correct API call if TTS is available
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    // Adjust based on the actual response format
    const mp3Buffer = Buffer.from(await response.arrayBuffer());

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': mp3Buffer.length,
    });
    res.send(mp3Buffer);
  } catch (error) {
    console.error('Error generating TTS:', error.response ? error.response.data : error.message);
    res.status(500).send('Error generating TTS');
  }
});

module.exports = router;
