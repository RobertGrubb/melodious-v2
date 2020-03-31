const http = require('http');
const express = require('express');
const cors = require('cors');
const youtubeAudioStream = require('@isolution/youtube-audio-stream');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const errors = require('./errors');
const youtube = require('./libs/youtube');


const app = express();
const port = 3007;

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ tracks: [] }).write()

const whitelist = [
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) return callback(null, true)
    return callback('Unauthorized')
  }
};

// For preflight requests
app.options('*', cors(corsOptions));

app.get('/tracks', cors(corsOptions), async (req, res) => {
  const data = db.get('tracks').value();

  response = data.map((track, index) => {
    return {
      id: track.raw.id,
      artist: track.raw.snippet.channelTitle,
      title: track.raw.snippet.title,
      duration: youtube.convertTime(track.raw.contentDetails.duration),
      cover: track.raw.snippet.thumbnails.default
    }
  });

  return res.status(200).json(response);
})

app.get('/track/add/:id', cors(corsOptions), async (req, res) => {
  const id = req.params.id;
  const data = await youtube.data(id);
  db.get('tracks').push(data).write();
  return res.status(200).json({success: true});
})

app.get('/stream/:id', async (req, res) => {
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
