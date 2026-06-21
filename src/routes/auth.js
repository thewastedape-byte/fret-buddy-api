const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');
const { v4: uuidv4 } = require('uuid');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, skill_level } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Check if user exists
    const { data: existing } = await supabase
      .from('fret_buddy_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const { data: user, error } = await supabase
      .from('fret_buddy_users')
      .insert({
        email,
        name: name || email.split('@')[0],
        password_hash,
        subscription: 'free',
        skill_level: skill_level || 'beginner',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const token = jwt.sign(
      { id: user.id, email: user.email, subscription: user.subscription },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        skill_level: user.skill_level,
      },
    });

  } catch (err) {
    console.error('[auth/register]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data: user, error } = await supabase
      .from('fret_buddy_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash || '');
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Update last active
    await supabase
      .from('fret_buddy_users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', user.id);

    const token = jwt.sign(
      { id: user.id, email: user.email, subscription: user.subscription },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        skill_level: user.skill_level,
      },
    });

  } catch (err) {
    console.error('[auth/login]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
