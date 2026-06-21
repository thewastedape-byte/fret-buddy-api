const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const supabase = require('../services/supabase');
const { v4: uuidv4 } = require('uuid');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const { image_base64, audio_base64, message, session_id, context, user_email } = req.body;

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
      // Transcribe audio first using Deepgram
      try {
        const audioBuffer = Buffer.from(audio_base64, 'base64');
        const fetch = require('node-fetch');
        
        const dgResponse = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
            'Content-Type': 'audio/webm',
          },
          body: audioBuffer,
        });

        if (dgResponse.ok) {
          const dgData = await dgResponse.json();
          const transcript = dgData?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
          if (transcript) {
            userContent.push({ type: 'text', text: `[Student said: "${transcript}"]` });
          }
        }
      } catch (e) {
        console.error('Deepgram error:', e.message);
      }
    }

    if (userContent.length === 0) {
      userContent.push({ type: 'text', text: 'Hello! I just started a lesson.' });
    }

    messages.push({ role: 'user', content: userContent });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 250,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || 'I\'m here to help! Show me your guitar position.';

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
      tokens_used: completion.usage?.total_tokens || 0,
    });

  } catch (err) {
    console.error('[teach]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
