import axios from 'axios';
import cookies from 'react-cookies';

const apiUrl = process.env.REACT_APP_API_URL;

const tracks = async () => {
  const res = await axios.get(`${apiUrl}/tracks`);
  return res.data;
}

const login = async (token) => {
  const res = await axios.post(`${apiUrl}/login`, { token });
  return res.data;
}

const session = async () => {
  const userId = cookies.load('userId');
  const res = await axios.get(`${apiUrl}/session/${userId}`);
  return res.data;
}

const playlist = async id => {
  const res = await axios.get(`${apiUrl}/playlist/${id}`);
  return res.data;
}

const addTrackToPlaylist = async (trackId, playlistId) => {
  const userId = cookies.load('userId');
  const res = await axios.post(`${apiUrl}/playlist/${playlistId}/track/${trackId}`);
  return res.data;
}

const createPlaylist = async (title, description) => {
  const userId = cookies.load('userId');

  const res = await axios.post(`${apiUrl}/playlist`, {
    title,
    description,
    userId
  });

  return res.data;
}

export default { tracks, login, session, createPlaylist, playlist, addTrackToPlaylist };
