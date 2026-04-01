import axios from 'axios';

const SERVER_LINK = import.meta.env.VITE_SERVER_LINK || 'http://localhost:3000/api/auth';

const API = axios.create({
  baseURL: SERVER_LINK,
  timeout: 5000
});

export const Register = async (credentials) => {
  try {
    const res = await API.post('/register', credentials);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};

export const Login = async (credentials) => {
  try {
    const res = await API.post('/login', credentials);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};
