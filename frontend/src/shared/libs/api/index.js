import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const tracks = async () => {
  const res = await axios.get(`${apiUrl}/tracks`);
  return res.data;
}

export default { tracks };
