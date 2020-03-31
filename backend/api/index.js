const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const youtubeAudioStream = require('@isolution/youtube-audio-stream');
const low = require('lowdb');
const shortid = require('shortid');
const FileSync = require('lowdb/adapters/FileSync');

// Local imports
const errors = require('./errors');
const youtube = require('./libs/youtube');
const twitch = require('./libs/twitch');

// Server variables
const app = express();
const port = 3007;

// Database variables
const adapter = new FileSync('db.json');
const db = low(adapter);

// Database defaults if file is empty.
db.defaults({ tracks: [], users: [] }).write();

// Whitelist for API routes
const whitelist = [
  'http://localhost:3000'
];

// corsOptions logic based on whitelist
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) return callback(null, true)
    return callback('Unauthorized')
  }
};

app.use(bodyParser.json());

// For preflight requests
app.options('*', cors(corsOptions));

/**
 * Gets track data from the database.
 * Maps and returns a clean object that the frontend
 * can easily read.
 */
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

/**
 * Adds a youtube video as a track to
 * the database.
 * @param {string} req.params.id Youtube video id
 */
app.get('/track/add/:id', cors(corsOptions), async (req, res) => {
  const id = req.params.id;
  const data = await youtube.data(id);
  db.get('tracks').push(data).write();
  return res.status(200).json({success: true});
})

/**
 * Streams a YouTube video in audio form.
 * Use an Audio Object from JavaScript or HTML and connect it to
 * http://localhost:3007/stream/iadh23t89h (video id)
 */
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

/**
 * Login using Twitch API v5.
 */
app.get('/session/:id', cors(corsOptions), async (req, res) => {
  if (!req.params.id) return errors.unauthorized(res);

  // Attempt to find a user that matches login in database.
  const user = db.get('users').find({ id: req.params.id }).value();

  if (!user) return errors.unauthorized(res);

  return res.status(200).json({
    id: user.id,
    login: user.login,
    userData: user.userData,
    success: true
  });
})

/**
 * Login using Twitch API v5.
 */
app.post('/login', cors(corsOptions), async (req, res) => {

  // If token is not provided, throw error
  if (!req.body.token) return errors.parameters(res);

  try {

    // Attempt to get access credentials based on token provided.
    const data = await twitch.getAccessCredentials(req.body.token);

    // If an error is received, respond 400.
    if (data.error) return res.status(400).json({error: true});

    // Normalize data from credentials request
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const scopes = data.scopes;
    const expiresIn = data.expires_in;
    const tokenType = data.token_type;

    try {

      // Get the user data for received access token.
      const userData = await twitch.getUserData(accessToken);

      // Will be setting this later.
      let id;

      // Get user data from the userData request
      const u = userData.data[0];

      // Attempt to find a user that matches login in database.
      const user = db.get('users').find({ login: u.login }).value();

      // If there is not an existing user.
      if (!user) {

        // Generate a new short id
        id = shortid.generate();

        // Add them to the database.
        db.get('users')
          .push({
            login: u.login,
            userData: u,
            id,
            accessToken,
            refreshToken,
            scopes,
            expiresIn,
            tokenType
          })
          .write();
      } else {

        // There was a user found, set the id.
        id = user.id;
      }

      // Return a 200 status along with user data.
      return res.status(200).json({
        id: id,
        login: u.login,
        userData: u,
        success: true
      });
    } catch (error) {

      // Thrown if userData returns an error
      return res.status(400).json({error: true});
    }
  } catch (error) {

    // Thrown if accessCredentials throws an error.
    return res.status(400).json({error: true});
  }
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
