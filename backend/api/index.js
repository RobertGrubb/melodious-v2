const http = require('http');
const express = require('express');
const cors = require('cors');
const errors = require('./errors');
const es = require('./libs/epidemicSound.js');

const app = express();
const port = 3007;

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
  const genre = req.query.genre;
  const data = await es.tracksByGenre(genre);
  return res.status(200).json(data);
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
