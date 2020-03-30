const axios = require('axios');
const fetch = require('node-fetch');

const url = 'https://www.epidemicsound.com/json/'
const esc = encodeURIComponent;

const tracksByGenre = async (genre) => {
  const endpoint = 'search/tracks/';

  const params = {
    genres: genre,
    order: 'desc',
    page: 1,
    sort: 'date'
  };

  const res = await axios.get(`${url}${endpoint}`, params);

  if (!res.data.entities) return {error: true};
  if (!res.data.entities.tracks) return {error: true};

  const response = Object.keys(res.data.entities.tracks).map((trackId) => {
    const track = res.data.entities.tracks[trackId];

    return {
      trackId,
      artist: track.creatives.mainArtists.length ? track.creatives.mainArtists[0] : {
        creativeType: "main_artist",
        name: "Unknown",
        slug: 'unknown'
      },
      title: track.title,
      bpm: track.bpm,
      duration: track.length,
      lqMediaUrl: track.stems.full.lqMp3Url,
      s3TrackId: track.stems.full.s3TrackId
    }
  });

  return response;
}

module.exports = {
  tracksByGenre
}
