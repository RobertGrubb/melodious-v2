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

export default { tracks, login, session };
