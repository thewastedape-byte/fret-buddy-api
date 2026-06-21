const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || 'guitar lesson beginner';
    const maxResults = parseInt(req.query.limit) || 5;

    const params = new URLSearchParams({
      part: 'snippet',
      q: `guitar lesson ${q}`,
      type: 'video',
      maxResults,
      key: process.env.YOUTUBE_API_KEY,
      videoCategoryId: '10', // Music
      relevanceLanguage: 'en',
    });

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    if (!response.ok) {
      const err = await response.json();
      console.error('[youtube]', err);
      return res.status(response.status).json({ error: 'YouTube search failed', details: err });
    }

    const data = await response.json();
    const videos = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      channel: item.snippet.channelTitle,
      published: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    res.json({ videos, total: videos.length });

  } catch (err) {
    console.error('[youtube]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
