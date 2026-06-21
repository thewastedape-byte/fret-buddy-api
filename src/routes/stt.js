const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// POST /api/stt - accepts multipart audio file OR base64 body
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    let audioBuffer;
    let mimeType = 'audio/webm';

    if (req.file) {
      audioBuffer = req.file.buffer;
      mimeType = req.file.mimetype || 'audio/webm';
    } else if (req.body.audio_base64) {
      audioBuffer = Buffer.from(req.body.audio_base64, 'base64');
      mimeType = req.body.mime_type || 'audio/webm';
    } else {
      return res.status(400).json({ error: 'No audio provided' });
    }

    const response = await axios.post(
      'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true',
      audioBuffer,
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': mimeType,
        },
        timeout: 20000,
        maxBodyLength: 25 * 1024 * 1024,
      }
    );

    const data = response.data;
    const transcript = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence = data?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;

    res.json({ transcript, confidence });

  } catch (err) {
    console.error('[stt]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
