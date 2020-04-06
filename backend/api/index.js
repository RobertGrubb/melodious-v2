const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const low = require('lowdb');
const shortid = require('shortid');
const FileSync = require('lowdb/adapters/FileSync');
const { config } = require('dotenv');
const fileUpload = require('express-fileupload');
const mp3Duration = require('mp3-duration');

// Load the .env file
config();

// Local imports
const errors = require('./errors');
const youtube = require('./libs/youtube');
const twitch = require('./libs/twitch');
const YoutubeDownloader = require('./libs/downloader');

// Instantiate the YouTube downloader
const downloader = new YoutubeDownloader({
  ffmpegPath: 'ffmpeg',
  fileSavePath: `${__dirname}/tracks/`,
  apiKey: process.env.YOUTUBE_API_KEY
});

// Server variables
const app = express();
const port = process.env.SERVER_PORT || 3007;

// Database variables
const adapter = new FileSync('melodious.json');
const db = low(adapter);

// Database defaults if file is empty.
db.defaults({ tracks: [], users: [], playlists: [] }).write();

/**
 * Define adminAccounts based on env variables.
 */
let adminAccounts = [];
if (process.env.ADMIN_ACCOUNTS) {
  adminAccounts = process.env.ADMIN_ACCOUNTS.split(',');
  console.log('Loaded admin accounts', adminAccounts);
}

// Whitelist for API routes
const whitelist = [
  'http://localhost:3000',
  'https://melodious.live'
];

// corsOptions logic based on whitelist
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) return callback(null, true)
    return callback('Unauthorized')
  }
};

// Use body Parser to retrieve POST variables
app.use(bodyParser.json());

// Use fileUpload middle ware to support files
app.use(fileUpload());

// For preflight requests
app.options('*', cors(corsOptions));

/**
 * Gets track data from the database.
 * Maps and returns a clean object that the frontend
 * can easily read.
 */
app.get('/tracks', cors(corsOptions), async (req, res) => {
  const data = db.get('tracks').value();

  return res.status(200).json(data);
})

/**
 * Streams a YouTube video in audio form.
 * Use an Audio Object from JavaScript or HTML and connect it to
 * http://localhost:3007/stream/iadh23t89h (video id)
 */
app.get('/stream/:id', async (req, res) => {
  const range = req.headers.range;
  const music = `${__dirname}/tracks/${req.params.id}.mp3`;
  const stat = fs.statSync(music);
  let readStream;

  if (range !== undefined) {
    const parts = range.replace(/bytes=/, "").split("-");

    const partial_start = parts[0];
    const partial_end = parts[1];

    if ((isNaN(partial_start) && partial_start.length > 1) ||
      (isNaN(partial_end) && partial_end.length > 1)) {
      return res.sendStatus(500);
    }

    const start = parseInt(partial_start, 10);
    const end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
    const content_length = (end - start) + 1;

    res.status(206).header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': content_length,
      'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
    });

    readStream = fs.createReadStream(music, { start, end });
  } else {
    res.header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });
    readStream = fs.createReadStream(music);
  }
  readStream.pipe(res);
})

/**
 * Retrieves a specific playlist
 */
app.get('/playlist/:id', cors(corsOptions), async (req, res) => {
  const playlistId = req.params.id;
  const playlist = db.get('playlists').find({ id: playlistId }).value();

  res.status(200).json({
    success: true,
    playlist
  });
});

/**
 * Adds a specific track to a specific playlist.
 */
app.post('/playlist/:playlistId/track/:trackId', cors(corsOptions), async (req, res) => {
  // Variables that are needed to move forward
  const playlistId = req.params.playlistId;
  const trackId = req.params.trackId;

  // Get the track and the playlist data
  const track = db.get('tracks').find({ id: trackId }).value();
  const playlist = db.get('playlists').find({ id: playlistId }).value();

  // Push the track to the playlist[tracks]
  playlist.tracks.push(track);

  // Write to the database.
  db.get('playlists').find({ id: playlistId }).assign({ tracks: playlist.tracks }).write();

  res.status(200).json({
    success: true,
    playlist
  });
});

/**
 * Create a playlist for the current session.
 */
app.post('/playlist', cors(corsOptions), async (req, res) => {
  // Get body params
  const { userId, title, description } = req.body;

  // If any are not present, return an error.
  if (!userId || !title || !description) return errors.parameters(res);

  // Find the user
  const user = db.get('users').find({ id: userId }).value();
  const playlists = user.playlists;

  // Generate a new playlist id
  const playlistId = shortid.generate();

  // Add the play list to the database
  playlists.push({
    id: playlistId,
    userId: userId,
    title,
    description
  });

  // Update user's playlists
  db.get('users')
    .find({ id: userId })
    .assign({ playlists })
    .write();

  // Add to playlists
  db.get('playlists')
    .push({
      id: playlistId,
      userId: userId,
      title,
      description,
      tracks: []
    })
    .write();

  res.status(200).json({
    success: true,
    playlists: playlists
  })
});

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
            playlists: [],
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
        success: true,
        playlists: user ? user.playlists : [],
        userLevel: adminAccounts.includes(u.login) ? 'admin' : 'user'
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

/**
 * Session handling route
 */
app.get('/session/:id', cors(corsOptions), async (req, res) => {
  if (!req.params.id) return errors.unauthorized(res);

  // Attempt to find a user that matches login in database.
  const user = db.get('users').find({ id: req.params.id }).value();

  // If no user was found, return unauthorized
  if (!user) return errors.unauthorized(res);

  // Return all session data.
  return res.status(200).json({
    id: user.id,
    login: user.login,
    userData: user.userData,
    playlists: user.playlists,
    success: true,
    userLevel: adminAccounts.includes(user.login) ? 'admin' : 'user'
  });
})

/**
 * ADMIN ROUTES
 *
 * Example of an admin route.
 *
 * @param { string } authId (Required for admin validation)
 *
 */
app.post('/admin/tracks/add', cors(corsOptions), async (req, res) => {
  // If no authId was provided, error out.
  if (!req.body.authId) return errors.unauthorized(res);

  // Route params validation
  const { type, title, artist, genre, credits } = req.body;
  if (!type || !title || !artist || !genre) return errors.parameters(res);

  // List of valid types for adding
  const validTypes = ['youtube', 'mp3'];

  // If not in the valid types.
  if (!validTypes.includes(type)) return res.status(400).json({error: 'INVALID_TYPE'});

  // Attempt to find a user that matches login in database.
  const user = db.get('users').find({ id: req.body.authId }).value();
  if (!user) return errors.unauthorized(res);

  // Are they an admin?
  if (!adminAccounts.includes(user.login)) return errors.unauthorized(res);

  // If fetch type is youtube.
  if (type === 'youtube') {
    // If no video id is provided, return error status.
    if (!req.body.videoId) return errors.parameters(res);

    // Initial data structure
    const data = { videoId: req.body.videoId };

    // Depending on what's provided, add it to the data object.
    if (title) data.title = title;
    if (artist) data.artist = artist;
    if (genre) data.genre = genre;

    // Start downloading the YouTube video as mp3.
    downloader.download(data, (error, response) => {

      // If an error was hit, return bad status.
      if (error)
        return res.status(400).json({ error });

      response.credits = (credits ? credits : false);

      // All is well, add it to the database.
      db.get('tracks').push(response).write();

      // Return a 200 status with track data.
      return res.status(200).json({ success: true, track: response });
    });

  // MP3 Type Addition
  } else if (type === 'mp3') {
    // TrackData should be accessible before hitting this endpoint.
    if (!req.body.trackData) return errors.parameters(res);

    // Setup the data structure
    const data = {
      id: req.body.trackData.trackId,
      title: title,
      fileName: req.body.trackData.filename,
      artist: artist,
      artistUrl: '',
      album: 'None',
      genre: genre,
      mood: 'None',
      duration: req.body.trackData.duration,
      credits: (credits ? credits : false)
    }

    // Add it to the database.
    db.get('tracks').push(data).write();

    // Return 200 with track data.
    return res.status(200).json({ success: true, track: data });

  // This type is unknown and is not supported.
  } else {
    return res.status(400).json({ error: 'TYPE_NOT_SUPPORTED' });
  }
})

/**
 * Upload an MP3, assign it an id that is returned
 * as well as the duration of the mp3.
 */
app.post('/admin/tracks/upload', cors(corsOptions), async (req, res) => {

  // If no files are present, error out.
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({
    error: 'NO_MP3_FILE'
  });

  // Get the mp3 file
  let file = req.files.file;

  // Generate a track id
  const trackId = shortid.generate();

  // Set the file name based on the track id.
  const filename = `${trackId}.mp3`;

  // Move the mp3 to the right destination.
  file.mv(`${__dirname}/tracks/${filename}`, async (err) => {

    // If there is an error, return a 500.
    if (err)
      return res.status(500).json({ error: err });

    // Set a default duration
    let duration = 0;

    // Attempt to retrieve the duration, or just return 0.
    try {
      const durationRes = await mp3Duration(`${__dirname}/tracks/${filename}`);
      duration = durationRes;
    } catch (error) {
      // Do nothing.
      console.log(error);
    }

    // Respond with the correct data.
    res.status(200).json({
      success: true,
      trackId,
      filename,
      duration
    })
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
