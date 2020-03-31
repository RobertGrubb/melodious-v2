const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { argv } = require('yargs');

/**
 * BEWARE:
 *
 * This uses A LOT of your API Quota, and will most likely exceed it
 * if called multiple times on a big playlist.
 */

// Local imports
const youtube = require('../libs/youtube');

if (!argv.playlistId) {
  console.error('No playlist id provided.');
  process.exit(0);
}

// Database variables
const adapter = new FileSync('../db.json');
const db = low(adapter);

// Database defaults if file is empty.
db.defaults({ tracks: [], users: [] }).write();

const id = argv.playlistId;

// Get playlist data
youtube.playlistData(id).then(async (playlist) => {

  // Get videos for playlist
  const videos = await playlist.getVideos();

  // For some reason, getVideos won't return a duration, so we have to
  // pull the video data itself in a new call within here.
  const response = await Promise.all(videos.map(async (track, index) => {
    const videoData = await youtube.video(track.id);

    // Setup the structure we need for the database.
    return {
      id: videoData.raw.id,
      artist: videoData.raw.snippet.channelTitle,
      title: videoData.raw.snippet.title,
      duration: youtube.convertTime(videoData.raw.contentDetails.duration),
      cover: videoData.raw.snippet.thumbnails.default
    }
  }));

  // Iterate through each and add it to the tracks list.
  response.forEach((track, index) => {
    console.log('Adding ' + track.id);
    db.get('tracks').push(track).write();
  });
});
