const shortid = require('shortid');
const fs = require('fs');
const request = require('request');
const axios = require('axios');
const argv = require('yargs').argv;
const low = require('lowdb');
const { config } = require('dotenv');
const FileSync = require('lowdb/adapters/FileSync');

config();

if (!process.env.YOUTUBE_AUDIO_LIBRARY_COOKIES) throw new Error('process.env.COOKIES is not set. Please create .env file.');

// Database variables
const adapter = new FileSync('melodious.json');
const db = low(adapter);

// Database defaults if file is empty.
db.defaults({ tracks: [], users: [], playlists: [] }).write();

const trackPath = `${__dirname}/tracks/`;
const audioFileType = '.mp3';

const tracks = async () => {
  const genre = (argv.genre ? argv.genre : false);
  const limit = (argv.limit ? argv.limit : 25);

  const params = {
    dl: true,
    s: 'music',
    mr: limit,
    si: 0,
    qid: 0,
    sh: true
  };

  if (genre) params.g = genre;

  let url = 'https://www.youtube.com/audioswap_ajax?action_get_tracks=1&';
  url += Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

  try {
    const res = await axios.get(url, {
      headers: {
        'accept': '*/*',
        'cookie': process.env.YOUTUBE_AUDIO_LIBRARY_COOKIES,
        'origin': 'https://www.youtube.com',
        'referer': 'https://www.youtube.com/audiolibrary/music?nv=1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
      }
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const addTrack = async (track) => {
  const trackId = shortid.generate();

  const dataStructure = {
    id: trackId,
    fileName: `${trackId}${audioFileType}`,
    title: track.title,
    artist: track.artist,
    artistUrl: track.artist_url,
    album: track.album,
    genre: track.genre,
    mood: track.mood,
    duration: track.len
  };

  db.get('tracks').push(dataStructure).write();

  const writer = fs.createWriteStream(`${trackPath}${trackId}${audioFileType}`)

  const response = await axios({
    url: track.download_url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

// const track = data.tracks[0];


const trackData = tracks().then(async (data) => {
  if (data.tracks.length) {
    for (let i = 0; i < data.tracks.length; i++) {
      let track = data.tracks[i];
      await addTrack(track);
    }
  }
});
