import axios from 'axios';

// VITE_API_URL chahe '', '/api', 'http://localhost:5000' ya 'http://localhost:5000/api' ho,
// base hamesha ek hi baar '/api' ke saath banega (AuthContext.jsx jaisa hi).
const RAW = import.meta.env.VITE_API_URL || '';
const BASE = RAW.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // HttpOnly JWT cookie
  timeout: 20000,
});

/** Turn any request failure into a message that is safe and useful to show. */
export function errorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (!err?.response) {
    return 'Could not reach the server. Please check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}