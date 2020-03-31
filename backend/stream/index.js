const http = require('http');
const express = require('express');
const cors = require('cors');
const errors = require('./errors');
const youtubeAudioStream = require('@isolution/youtube-audio-stream');

const app = express();
const port = 3008;

const whitelist = [
  'http://localhost:3000',
  'http://projects.com/'
];

const corsOptions = {
  origin: '*'
};

// For preflight requests
app.options('*', cors(corsOptions));

app.get('/stream/:id', cors(corsOptions), async (req, res) => {
  const requestUrl = `http://youtube.com/watch?v=${req.params.id}`;
  youtubeAudioStream(requestUrl)
    .then(stream => {
      console.log('test');
      stream.emitter.on('error', err => {
        console.log(err);
      });
      stream.pipe(res);
    })
    .catch(err => {
      console.log(err);
    });
})

// ===================================
// Status route
// ===================================
app.get('/status', (req, res) => {
  res.json({
    status: 'OK'
  });
})

// ===================================
// HTTP Server initilization
// ===================================
http.createServer(app).listen(port, () => {
  console.log(`Music API server running on ${port}`)
})
