require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

const urls = {};
let count = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;

  // Validate the URL format
  try {
    const url = new URL(originalUrl);
    // Validate the domain using DNS lookup
    dns.lookup(url.hostname, (err) => {
      if (err) {
        res.json({ error: 'invalid url' });
      } else {
        // Create short URL
        const shortUrl = count++;
        urls[shortUrl] = originalUrl;
        res.json({ original_url: originalUrl, short_url: shortUrl });
      }
    });
  } catch (error) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = parseInt(req.params.short_url);
  const originalUrl = urls[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'short url not found' });
  }
});

// API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
