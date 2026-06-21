const express = require('express');
const router = express.Router();

const THEORY_CONTENT = {
  scales: {
    title: 'Guitar Scales',
    intro: 'Scales are the building blocks of all music. Master these and you can play anywhere on the neck.',
    items: [
      {
        name: 'Minor Pentatonic Scale',
        description: 'The most important scale for rock and blues. 5 notes, infinite possibilities.',
        key: 'A minor',
        positions: ['Position 1 (Box shape): 5th fret', 'Position 2: 8th fret', 'Position 3: 10th fret'],
        pattern: [
          { string: 'e', frets: [5, 8] },
          { string: 'B', frets: [5, 8] },
          { string: 'G', frets: [5, 7] },
          { string: 'D', frets: [5, 7] },
          { string: 'A', frets: [5, 7] },
          { string: 'E', frets: [5, 8] },
        ],
        tab: `e|---5---8-|
B|---5---8-|
G|---5---7-|
D|---5---7-|
A|---5---7-|
E|---5---8-|`,
        notes: ['A', 'C', 'D', 'E', 'G'],
        tip: 'Learn Position 1 first. Every blues and rock solo you love uses this shape.',
        examples: ['BB King', 'Eric Clapton', 'Jimi Hendrix', 'Slash'],
      },
      {
        name: 'Major Pentatonic Scale',
        description: 'The happy, country/pop cousin of minor pentatonic. 5 notes that work over major chords.',
        key: 'G major',
        tab: `e|---2---5-|
B|---3---5-|
G|---2---4-|
D|---2---5-|
A|---2---5-|
E|---3---5-|`,
        notes: ['G', 'A', 'B', 'D', 'E'],
        tip: 'Country, pop, and classic rock solos often use this. Think Eagles, Tom Petty.',
      },
      {
        name: 'Natural Minor Scale (Aeolian)',
        description: 'The full 7-note minor scale. Dark, emotional, used everywhere in rock.',
        key: 'A minor',
        tab: `e|---5---7---8-|
B|---5---6---8-|
G|---5---7-----|
D|---5---7---8-|
A|---5---7---8-|
E|---5---7---8-|`,
        notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        tip: 'Same notes as C major but starting on A. Adds the b2 and b6 for extra darkness.',
      },
      {
        name: 'Blues Scale',
        description: 'Minor pentatonic + the "blue note" (b5). That note is the secret to bluesy sound.',
        key: 'A blues',
        tab: `e|---5---6---8-|
B|---5---6---8-|
G|---5---6---7-|
D|---5---6---7-|
A|---5---7-----|
E|---5---8-----|`,
        notes: ['A', 'C', 'D', 'Eb', 'E', 'G'],
        tip: 'The Eb (blue note) on the 6th fret is your money note. Bend it up for maximum blues.',
      },
    ],
  },
  chords: {
    title: 'Essential Guitar Chords',
    intro: 'These chords cover 95% of all popular songs. Master them and you can play almost anything.',
    categories: [
      {
        name: 'Open Chords - Major',
        chords: [
          { name: 'E major', fingering: '022100', fingers: 'x23100', tip: 'The most common open chord. Anchor the 1st finger.' },
          { name: 'A major', fingering: 'x02220', fingers: 'x01230', tip: 'Three fingers in a row. Keep them arched!' },
          { name: 'D major', fingering: 'xx0232', fingers: 'xx0132', tip: 'Diamond shape. Don\'t let fingers touch adjacent strings.' },
          { name: 'G major', fingering: '320003', fingers: '210003', tip: 'Many versions. Start with 3-finger version, then 4-finger.' },
          { name: 'C major', fingering: 'x32010', fingers: 'x32010', tip: 'Tricky stretch! Index on 1st fret B string, pinky anchors.' },
        ],
      },
      {
        name: 'Open Chords - Minor',
        chords: [
          { name: 'Em', fingering: '022000', fingers: 'x23000', tip: 'Easiest chord! Great starting point for beginners.' },
          { name: 'Am', fingering: 'x02210', fingers: 'x01230', tip: 'Like E major shape shifted. Very common in rock and pop.' },
          { name: 'Dm', fingering: 'xx0231', fingers: 'xx0231', tip: 'Muted low strings. Sad, emotional sound.' },
        ],
      },
      {
        name: 'Power Chords',
        chords: [
          { name: 'E5 Power Chord', fingering: '022xxx', fingers: '01xxxx', tip: 'Root on low E. Move this shape anywhere on the neck!' },
          { name: 'A5 Power Chord', fingering: 'x022xx', fingers: 'x01xxx', tip: 'Root on A string. Use palm mute for heavy sound.' },
        ],
      },
      {
        name: 'Barre Chords',
        chords: [
          { name: 'F major (E-shape barre)', fingering: '133211', fingers: '134211', tip: 'The infamous F chord! Index finger barres all 6 strings at fret 1.' },
          { name: 'Bm (A-shape barre)', fingering: 'x24432', fingers: 'x13342', tip: 'Index on 2nd fret A-E strings (partial barre). Very common in pop.' },
        ],
      },
    ],
  },
  progressions: {
    title: 'Common Chord Progressions',
    intro: 'These progressions are the secret sauce of pop and rock music. Learn to recognize them by ear.',
    items: [
      {
        name: 'I-IV-V (The Blues)',
        description: 'The foundation of blues and rock. 12-bar blues uses this.',
        example_key: 'E',
        chords: ['E', 'A', 'B'],
        songs: ['Johnny B. Goode - Chuck Berry', 'La Grange - ZZ Top', 'Kansas City - Leiber/Stoller'],
        tip: 'In any key: root chord, move up 4 frets (IV), move up 7 frets (V).',
      },
      {
        name: 'I-V-vi-IV (The Pop Progression)',
        description: '50% of all pop songs use this. Literally.',
        example_key: 'G',
        chords: ['G', 'D', 'Em', 'C'],
        songs: ['Let It Be - Beatles', 'No Woman No Cry - Marley', 'With or Without You - U2'],
        tip: 'Memorize this in G and C. You can play hundreds of songs.',
      },
      {
        name: 'ii-V-I (The Jazz Turnaround)',
        description: 'The cornerstone of jazz harmony. Works in every major key.',
        example_key: 'C',
        chords: ['Dm7', 'G7', 'Cmaj7'],
        songs: ['Autumn Leaves', 'All The Things You Are', 'Misty'],
        tip: 'The strongest cadence in Western music. Learn it!',
      },
      {
        name: 'I-vi-IV-V (50s Progression)',
        description: 'Classic doo-wop and pop ballad sound.',
        example_key: 'C',
        chords: ['C', 'Am', 'F', 'G'],
        songs: ['Stand By Me - Ben E. King', 'Earth Angel', 'Blue Moon'],
        tip: 'Very similar to I-V-vi-IV. Swap the order for different feels.',
      },
      {
        name: 'vi-IV-I-V (Minor Key Pop)',
        description: 'Emotional, melancholic pop progression.',
        example_key: 'Am',
        chords: ['Am', 'F', 'C', 'G'],
        songs: ['Somebody That I Used to Know - Gotye', 'Mad World - Tears for Fears', 'Radioactive - Imagine Dragons'],
        tip: 'Same 4 chords as I-V-vi-IV, different starting point = different emotion!',
      },
    ],
  },
  circle_of_fifths: {
    title: 'Circle of Fifths',
    intro: 'The most powerful tool in music theory. Understand this, and keys, scales, and chord relationships become clear.',
    keys_clockwise: ['C', 'G', 'D', 'A', 'E', 'B', 'F#/Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'],
    relative_minors: ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m/Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'],
    guitar_friendly_keys: {
      major: ['G', 'D', 'A', 'E', 'C'],
      minor: ['Em', 'Am', 'Dm', 'Bm'],
    },
    explanation: 'Each key is a perfect 5th above the previous. Keys next to each other share 6 of 7 notes - that\'s why modulating to adjacent keys sounds smooth.',
  },
  techniques: {
    title: 'Guitar Techniques',
    items: [
      {
        name: 'String Bending',
        description: 'Push or pull a string to raise its pitch without fretting a higher note.',
        steps: [
          'Fret the target note (e.g., 7th fret G string)',
          'Support with 2 or 3 fingers behind the fretting finger',
          'Push the string toward the ceiling (or pull toward floor on B/e)',
          'Aim for a half step (1 fret up) or whole step (2 frets up)',
        ],
        tip: 'BB King said: "I don\'t play many notes, I just bend the hell out of the ones I play."',
      },
      {
        name: 'Vibrato',
        description: 'Rhythmic up-and-down pitch variation on a sustained note. The most personal technique.',
        steps: [
          'Fret and play a note',
          'Rapidly rock your fretting finger up and down (or side to side)',
          'Keep the pitch fluctuating rhythmically',
          'Start slow, increase speed and depth with practice',
        ],
        tip: 'Your vibrato is your guitar voice. Listen to BB King, Hendrix, and Clapton - all totally different!',
      },
      {
        name: 'Hammer-Ons & Pull-Offs',
        description: 'Legato technique - connecting notes without picking each one.',
        steps: [
          'Hammer-on: Pick a note, then "hammer" a higher finger onto a higher fret on the same string',
          'Pull-off: Fret two notes simultaneously, pick the higher one, then pull the fretting finger off',
          'Practice slowly, ensuring each note sounds clearly without picking',
        ],
        tip: 'Master these and your solos will flow like water instead of sounding choppy.',
      },
      {
        name: 'Palm Muting',
        description: 'Resting the picking hand palm on the strings near the bridge for a tight, chunky sound.',
        steps: [
          'Rest the fleshy edge of your picking hand on the strings just above the saddle',
          'Keep contact light - too much mutes completely, too little has no effect',
          'Pick normally while maintaining palm contact',
        ],
        tip: 'Metallica, Pantera, and all metal rhythm is built on palm muting. Essential for heavy rhythm.',
      },
    ],
  },
};

// GET /api/theory/:topic
router.get('/:topic', (req, res) => {
  const { topic } = req.params;
  const content = THEORY_CONTENT[topic];

  if (!content) {
    return res.status(404).json({
      error: 'Topic not found',
      available: Object.keys(THEORY_CONTENT),
    });
  }

  res.json(content);
});

// GET /api/theory - list all topics
router.get('/', (req, res) => {
  res.json({
    topics: Object.keys(THEORY_CONTENT).map(key => ({
      id: key,
      title: THEORY_CONTENT[key].title,
    })),
  });
});

module.exports = router;
