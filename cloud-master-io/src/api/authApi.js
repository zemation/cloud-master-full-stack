// src/api/authApi.js

import axios from 'axios';
import { API_URL } from '../config/config';

const AUTH_URL = `${API_URL}/users`;

// Register
export const register = async (userData) => {
  const response = await axios.post(`${AUTH_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login
export const login = async (userData) => {
  const response = await axios.post(`${AUTH_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('user');
};