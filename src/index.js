require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now (mobile apps don't send origin)
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const teachRoute = require('./routes/teach');
const ttsRoute = require('./routes/tts');
const sttRoute = require('./routes/stt');
const youtubeRoute = require('./routes/youtube');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const tabsRoute = require('./routes/tabs');
const theoryRoute = require('./routes/theory');
const metronomeRoute = require('./routes/metronome');
const stripeRoute = require('./routes/stripe');

app.use('/api/teach', teachRoute);
app.use('/api/tts', ttsRoute);
app.use('/api/stt', sttRoute);
app.use('/api/youtube', youtubeRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/tabs', tabsRoute);
app.use('/api/theory', theoryRoute);
app.use('/api/metronome', metronomeRoute);
app.use('/api/stripe', stripeRoute);

// Health check
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fret-buddy-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({ message: '🎸 Fret Buddy API is running!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`🎸 Fret Buddy API running on port ${PORT}`);
});

// Extend timeout to 60s for OpenAI vision calls
server.setTimeout(60000);

module.exports = app;
