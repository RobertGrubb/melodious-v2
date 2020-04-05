// Imports
const YoutubeDownloader = require('./libs/downloader');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const argv = require('yargs').argv;
const { config } = require('dotenv');

// Load the dotenv config
config();

// If videoId is not provided, return an error.
if (!argv.videoId) throw new Error('Can not proceed without a video id.');

// Database variables
const adapter = new FileSync('melodious.json');
const db = low(adapter);

// Instantiation for the downloader
const downloader = new YoutubeDownloader({
  ffmpegPath: 'ffmpeg',
  fileSavePath: `${__dirname}/tracks/`,
  apiKey: process.env.YOUTUBE_API_KEY
});

// Setup data object
const data = { videoId: argv.videoId };
if (argv.title) data.title = argv.title;
if (argv.artist) data.artist = argv.artist;
if (argv.genre) data.genre = argv.genre;
if (argv.album) data.album = argv.album;

// Download the video
downloader.download(data, (error, res) => {
  console.log(res);
  console.log('Writing to database');

  // Add it to the tracks database
  db.get('tracks').push(res).write();
});
