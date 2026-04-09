const express = require('express');
const https   = require('https');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const API_KEY = '236ca5027f10499b83d53864805c1e4a';
const API_BASE = 'https://api.football-data.org/v4';

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint — browser calls /api?path=/competitions/PL/matches
// Server forwards to football-data.org with the auth token
app.get('/api', (req, res) => {
  const apiPath = req.query.path;
  if (!apiPath) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  const url = API_BASE + apiPath;
  const options = {
    headers: {
      'X-Auth-Token': API_KEY,
      'User-Agent':   'KickOffPro/1.0',
    }
  };

  https.get(url, options, (apiRes) => {
    let body = '';
    apiRes.on('data', chunk => body += chunk);
    apiRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(apiRes.statusCode).send(body);
    });
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

// Fallback — serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`KickOff Pro running on port ${PORT}`);
});
