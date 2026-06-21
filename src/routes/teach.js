const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('../services/supabase');
const { v4: uuidv4 } = require('uuid');

const SYSTEM_PROMPT = `You are an expert guitar teacher with 30 years of experience teaching students from complete beginners to advanced players. Your name is Buddy.

When analyzing images:
- Carefully examine finger placement, hand position, thumb position, and wrist angle
- Identify which chord or note is being played
- Give SPECIFIC feedback: which finger (index/middle/ring/pinky), which fret number, which string (1st/high E through 6th/low E)
- Never be vague — always be specific

When analyzing audio:
- Identify the notes/chord being played
- Note tuning issues, rhythm problems, or timing concerns
- Comment on tone quality if relevant

Teaching style:
- Warm, encouraging, never discouraging
- Celebrate small wins enthusiastically  
- Reference real guitarists (Jimi Hendrix, Eric Clapton, BB King, etc.) for context
- Break complex techniques into small, achievable steps
- Use analogies that make sense to beginners
- Keep responses concise but complete — no unnecessary padding
- If you see good technique, say so specifically!

Always structure responses as:
1. What you observe (brief)
2. Specific feedback or correction (main content)  
3. One actionable tip to improve right now`;

router.post('/', async (req, res) => {
  try {
    const { image_base64, audio_base64, audio_format, analyze_audio, message, session_id, context, user_email } = req.body;
    const model = 'gpt-4o';

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    // Add conversation context if provided
    if (context && Array.isArray(context)) {
      messages.push(...context.slice(-6)); // Last 6 messages for context
    }

    // Build user message content
    const userContent = [];

    if (message) {
      userContent.push({ type: 'text', text: message });
    }

    if (image_base64) {
      // Remove data URL prefix if present
      const base64Data = image_base64.replace(/^data:image\/[a-z]+;base64,/, '');
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Data}`,
          detail: 'low',
        },
      });
    }

    if (audio_base64) {
      // Transcribe audio via Whisper (works for both speech and guitar playing)
      try {
        const FormData = require('form-data');
        const audioBuffer = Buffer.from(audio_base64.replace(/^data:[^;]+;base64,/, ''), 'base64');
        const ext = (audio_format || 'webm').includes('mp4') ? 'mp4' : 'webm';
        const form = new FormData();
        form.append('file', audioBuffer, { filename: `audio.${ext}`, contentType: `audio/${ext}` });
        form.append('model', 'whisper-1');
        if (analyze_audio) {
          form.append('prompt', 'Guitar playing, musical notes, chords, strumming patterns');
        }
        const whisperRes = await axios.post(
          'https://api.openai.com/v1/audio/transcriptions',
          form,
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              ...form.getHeaders(),
            },
            timeout: 30000,
          }
        );
        const transcript = whisperRes.data?.text || '';
        if (analyze_audio) {
          userContent.push({
            type: 'text',
            text: transcript
              ? `[Student played guitar. Whisper heard: "${transcript}". Analyze their playing technique, timing, and any notes/chords detected. Give specific musical feedback.]`
              : '[Student played guitar — no clear notes detected. Analyze their technique from the camera image and encourage them to keep practicing.]',
          });
        } else if (transcript) {
          userContent.push({ type: 'text', text: `[Student said: "${transcript}"]` });
        }
      } catch (e) {
        console.error('Whisper error:', e.message);
        if (analyze_audio) {
          userContent.push({ type: 'text', text: '[Student played guitar — analyze their technique from the camera image.]' });
        }
      }
    }

    if (userContent.length === 0) {
      userContent.push({ type: 'text', text: 'Hello! I just started a lesson.' });
    }

    messages.push({ role: 'user', content: userContent });

    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model, messages, max_tokens: 400, temperature: 0.7 },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 55000,
      }
    );

    const responseText = completion.data.choices[0]?.message?.content || 'I\'m here to help! Show me your guitar position.';

    // Save session to Supabase if session_id
    if (session_id) {
      try {
        const { data: existing } = await supabase
          .from('fret_buddy_sessions')
          .select('messages')
          .eq('id', session_id)
          .single();

        if (existing) {
          const updatedMessages = [
            ...(existing.messages || []),
            { role: 'user', content: message || '[image/audio]', ts: Date.now() },
            { role: 'assistant', content: responseText, ts: Date.now() },
          ];
          await supabase
            .from('fret_buddy_sessions')
            .update({ messages: updatedMessages })
            .eq('id', session_id);
        }
      } catch (e) {
        // Non-fatal
      }
    }

    res.json({
      response_text: responseText,
      session_id: session_id || uuidv4(),
      tokens_used: completion.data.usage?.total_tokens || 0,
    });

  } catch (err) {
    console.error('[teach]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
