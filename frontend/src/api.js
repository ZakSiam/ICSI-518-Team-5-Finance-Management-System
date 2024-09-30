import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/accounts',  // Backend URL
});

export const registerUser = (data) => API.post('/register/', data);
export const loginUser = (data) => API.post('/login/', data);
export const logoutUser = () => API.post('/logout/');
export const changePassword = (data) => API.post('/change-password/', data);
export const forgotPassword = (data) => API.post('/password-reset/', data);
