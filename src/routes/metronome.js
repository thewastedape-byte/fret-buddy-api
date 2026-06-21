const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// GET /api/metronome - returns default config
router.get('/', (req, res) => {
  res.json({
    default_bpm: 80,
    min_bpm: 20,
    max_bpm: 300,
    time_signatures: ['4/4', '3/4', '6/8', '2/4', '5/4'],
    default_time_signature: '4/4',
    subdivisions: [1, 2, 4],
    practice_tempos: [
      { label: 'Very Slow (Practice)', bpm: 50 },
      { label: 'Slow', bpm: 70 },
      { label: 'Medium Slow', bpm: 90 },
      { label: 'Medium', bpm: 110 },
      { label: 'Medium Fast', bpm: 130 },
      { label: 'Fast', bpm: 160 },
      { label: 'Very Fast', bpm: 200 },
    ],
  });
});

// POST /api/metronome/save - save user's preferred BPM
router.post('/save', async (req, res) => {
  try {
    const { user_id, bpm, time_signature } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });

    const { error } = await supabase
      .from('fret_buddy_users')
      .update({ preferred_bpm: bpm, preferred_time_sig: time_signature })
      .eq('id', user_id);

    if (error) throw new Error(error.message);
    res.json({ saved: true, bpm, time_signature });

  } catch (err) {
    console.error('[metronome]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
