const express = require('express');
const router = express.Router();

// Curated tab database - beginner to intermediate songs
const TABS_DB = [
  {
    id: '1',
    title: 'Smoke on the Water',
    artist: 'Deep Purple',
    difficulty: 'beginner',
    tuning: 'Standard',
    genre: 'Rock',
    tags: ['riff', 'classic', 'iconic'],
    tab: `e|----------------------------------------|
B|----------------------------------------|
G|-0-3-5-0-3-6-5-0-3-5-3-0---------------|
D|-0-3-5-0-3-6-5-0-3-5-3-0---------------|
A|----------------------------------------|
E|----------------------------------------|

This is the famous main riff. Play the two strings together.
Timing: Slow, steady - get the feel before adding speed.`,
    chords: ['G5', 'Bb5', 'C5'],
    bpm: 112,
  },
  {
    id: '2',
    title: 'Sweet Home Chicago (Intro Riff)',
    artist: 'Robert Johnson',
    difficulty: 'beginner',
    tuning: 'Standard',
    genre: 'Blues',
    tags: ['blues', 'classic', 'chicago'],
    tab: `e|-------0---0---0---0----|
B|-----3---3---1---1------|
G|---2---------2------2---|
D|-0-----------0----------|
A|------------------------|
E|------------------------|

Classic blues shuffle rhythm. Focus on smooth string transitions.`,
    chords: ['E7', 'A7', 'B7'],
    bpm: 120,
  },
  {
    id: '3',
    title: 'Wonderwall - Intro Chords',
    artist: 'Oasis',
    difficulty: 'beginner',
    tuning: 'Standard',
    genre: 'Rock',
    tags: ['chords', 'popular', 'campfire'],
    tab: `Capo 2nd fret

Em7: 022033
G:   320033  
Dsus4: xx0233
A7sus4: x02033

Strumming: D DU UDU
Most popular campfire song ever!`,
    chords: ['Em7', 'G', 'Dsus4', 'A7sus4'],
    bpm: 87,
  },
  {
    id: '4',
    title: 'Stairway to Heaven - Intro',
    artist: 'Led Zeppelin',
    difficulty: 'intermediate',
    tuning: 'Standard',
    genre: 'Rock',
    tags: ['fingerpicking', 'classic', 'iconic'],
    tab: `e|--8---7---5---3---2---0---2---|
B|----8---8---5---3---3---3---3-|
G|------------------------------|
D|------------------------------|
A|-7---5---3---2----------------|
E|------------------------------|

Jimmy Page's immortal intro. Use fingerpicking - thumb on bass, fingers on treble.`,
    chords: ['Am', 'Am/G#', 'Am/G', 'Am/F#', 'Fmaj7', 'G', 'Am'],
    bpm: 75,
  },
  {
    id: '5',
    title: 'Come As You Are',
    artist: 'Nirvana',
    difficulty: 'beginner',
    tuning: 'Standard (slight drop)',
    genre: 'Grunge',
    tags: ['riff', 'grunge', '90s'],
    tab: `e|--0---0---0---0---0---0---0---0--|
B|--0---0---0---0---0---0---0---0--|
G|--0---0---0---0---0---0---0---0--|
D|--2---2---2---2---0---0---2---2--|
A|--2---2---2---2---2---2---2---2--|
E|--0---0---0---0---3---3---0---0--|

Alternate between Em and G. Clean tone with slight chorus.`,
    chords: ['Em', 'G'],
    bpm: 120,
  },
  {
    id: '6',
    title: 'Nothing Else Matters - Intro',
    artist: 'Metallica',
    difficulty: 'intermediate',
    tuning: 'Standard',
    genre: 'Metal/Rock',
    tags: ['fingerpicking', 'ballad', 'metallica'],
    tab: `e|-0---0---0---0---0---0---0---0--|
B|---0---0---0---0---0---0---0----|
G|-----9-----9-----8-----8--------|
D|------7------7-----7-----7------|
A|--------------------------------|
E|-0-----------0-----------0------|

Let every note ring out. This is pure fingerpicking - no picks needed.`,
    chords: ['Em', 'Am', 'C', 'G'],
    bpm: 69,
  },
  {
    id: '7',
    title: 'Blackbird',
    artist: 'The Beatles',
    difficulty: 'intermediate',
    tuning: 'Standard',
    genre: 'Pop/Folk',
    tags: ['fingerpicking', 'beatles', 'acoustic'],
    tab: `e|--0---2---0---2---3---2---0---2--|
B|--3---3---1---3---3---3---3---3--|
G|--0---2---2---2---0---2---0---2--|
D|--2---0---2---0---0---0---2---0--|
A|---------------------------------|
E|-3-----------3-------------------| 

Paul McCartney's masterpiece. Combine bass melody with treble melody simultaneously.`,
    chords: ['G', 'Am7', 'G/B', 'C'],
    bpm: 96,
  },
  {
    id: '8',
    title: 'Purple Haze - Intro',
    artist: 'Jimi Hendrix',
    difficulty: 'intermediate',
    tuning: 'Eb (half step down)',
    genre: 'Rock/Blues',
    tags: ['riff', 'hendrix', 'blues', 'rock'],
    tab: `e|--------------------------------|
B|--------------------------------|
G|----7b9--7b9-7-5----------------|
D|--7------------------7-5--------|
A|-----------------------------7--|
E|-8------------------------------|

The legendary tritone opener. Tune down half step. Feel the Hendrix magic!`,
    chords: ['E7#9', 'G', 'A'],
    bpm: 138,
  },
  {
    id: '9',
    title: 'Wish You Were Here - Intro',
    artist: 'Pink Floyd',
    difficulty: 'intermediate',
    tuning: 'Standard',
    genre: 'Rock/Progressive',
    tags: ['fingerpicking', 'pink floyd', 'acoustic'],
    tab: `e|--0h2-2---2-0----0----3---3-0---|
B|----0---0---0----0----3---3-----|
G|----0---0---0----0----0---0-----|
D|----2---2---2----2----0---0-----|
A|-0-----------3-3-----------2-2--|
E|--------------------------------|

Pure acoustic perfection. Two guitar interplay - learn both parts!`,
    chords: ['Em7', 'G', 'A7sus4', 'C', 'D', 'Am'],
    bpm: 63,
  },
  {
    id: '10',
    title: 'Sweet Child O Mine - Intro',
    artist: 'Guns N Roses',
    difficulty: 'intermediate',
    tuning: 'Standard',
    genre: 'Rock/Hard Rock',
    tags: ['riff', 'slash', 'iconic', 'arpeggio'],
    tab: `e|--12---12---9---12---9---12---9---|
B|----12---12---12---12---12--------|
G|----------------------------------|
D|----------------------------------|
A|----------------------------------|
E|----------------------------------|

Slash's iconic opening. Use alternate picking. Start SLOW - speed will come naturally.`,
    chords: ['D', 'C', 'Bb', 'A'],
    bpm: 122,
  },
];

// GET /api/tabs/search?q=query&difficulty=beginner&genre=rock
router.get('/search', (req, res) => {
  const { q = '', difficulty, genre } = req.query;
  const query = q.toLowerCase();

  let results = TABS_DB;

  if (query) {
    results = results.filter(tab =>
      tab.title.toLowerCase().includes(query) ||
      tab.artist.toLowerCase().includes(query) ||
      tab.tags.some(t => t.includes(query)) ||
      tab.genre.toLowerCase().includes(query)
    );
  }

  if (difficulty) {
    results = results.filter(tab => tab.difficulty === difficulty.toLowerCase());
  }

  if (genre) {
    results = results.filter(tab => tab.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  res.json({ tabs: results, total: results.length });
});

// GET /api/tabs/:id
router.get('/:id', (req, res) => {
  const tab = TABS_DB.find(t => t.id === req.params.id);
  if (!tab) return res.status(404).json({ error: 'Tab not found' });
  res.json(tab);
});

module.exports = router;
