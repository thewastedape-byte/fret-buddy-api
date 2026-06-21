# 🎸 Fret Buddy API

AI-powered guitar teacher backend. Built with Node.js + Express, Supabase, OpenAI GPT-4o Vision, ElevenLabs TTS, and Deepgram STT.

## Quick Start

```bash
npm install
cp .env.example .env
# Fill in your API keys in .env
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /status | Health check |
| POST | /api/teach | Main AI teacher (vision + audio) |
| POST | /api/tts | Text to speech (ElevenLabs) |
| POST | /api/stt | Speech to text (Deepgram) |
| GET | /api/youtube/search | YouTube lesson search |
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/user/:email | Get user + progress |
| GET | /api/tabs/search | Search tabs |
| GET | /api/tabs/:id | Get specific tab |
| GET | /api/theory | List theory topics |
| GET | /api/theory/:topic | Get theory content |
| GET | /api/metronome | Metronome config |
| GET | /api/stripe/plans | Subscription plans |
| POST | /api/stripe/checkout | Create Stripe checkout |

## Manual Setup Required

### 1. Supabase Schema
Run `supabase-schema.sql` in the Supabase SQL editor:
https://supabase.com/dashboard/project/yruuzkxpnbgruwuivchy/sql

### 2. Environment Variables on Render
After deploy, set these in Render dashboard → Environment:
- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_KEY`
- `DEEPGRAM_API_KEY`
- `ELEVENLABS_API_KEY`
- `YOUTUBE_API_KEY`
- `STRIPE_SECRET_KEY`
- `JWT_SECRET` (generate a random string)

### 3. Stripe Webhook (Optional)
For subscription management, add a webhook in Stripe dashboard pointing to:
`https://your-render-url.onrender.com/api/stripe/webhook`

## Deployment (Render)
Push to GitHub → connect repo in Render → auto-deploys on push.
Uses `render.yaml` for configuration.
