import axios from 'axios';

const deezerCorsProxy = 'http://127.0.0.1:3007/';
const deezerApiUrl = `${deezerCorsProxy}https://api.deezer.com`;
const playlistId   = 7452608704;

const playlist = async () => {
  const res = await axios.get(`${deezerApiUrl}/playlist/${playlistId}`);
  return res;
}

export default {
  playlist
};
