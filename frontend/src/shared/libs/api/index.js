import axios from 'axios';

const apiUrl = 'http://127.0.0.1:3007';

const tracks = async () => {
  const res = await axios.get(`${apiUrl}/tracks?genre=Electronica Dance`);
  return res.data;
}

export default {
  tracks
};
