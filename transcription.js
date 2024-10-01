// transcription.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    const audioBuffer = req.file.buffer;

    const formData = new FormData();
    formData.append('model', 'whisper-1');
    formData.append('file', audioBuffer, {
      filename: 'recording.wav',
      contentType: 'audio/wav',
    });

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const transcription = response.data.text;

    res.json({ transcription });
  } catch (error) {
    console.error('Transcription Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

module.exports = router;
