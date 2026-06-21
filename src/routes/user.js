const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// GET /api/user/:email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const { data: user, error } = await supabase
      .from('fret_buddy_users')
      .select('id, email, name, subscription, skill_level, created_at, last_active')
      .eq('email', decodeURIComponent(email))
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    // Get progress
    const { data: progress } = await supabase
      .from('fret_buddy_progress')
      .select('*')
      .eq('user_id', user.id);

    // Get session count
    const { count: sessionCount } = await supabase
      .from('fret_buddy_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    res.json({ ...user, progress: progress || [], session_count: sessionCount || 0 });

  } catch (err) {
    console.error('[user]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/user/:email
router.patch('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;
    delete updates.password_hash; // Never update password this way

    const { data: user, error } = await supabase
      .from('fret_buddy_users')
      .update(updates)
      .eq('email', decodeURIComponent(email))
      .select('id, email, name, subscription, skill_level')
      .single();

    if (error) throw new Error(error.message);
    res.json(user);

  } catch (err) {
    console.error('[user/patch]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
