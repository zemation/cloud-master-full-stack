// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// CRITICAL: Ensure this path is correct for your configuration file
import { API_ROOT_URL } from '../../config/config.js'; 

const USER_API_URL = `${API_ROOT_URL}users/`;

// Get user from localStorage (to persist login across sessions)
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Helper function to read error message robustly
const extractErrorMessage = (error) => 
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();

// --- Thunks (Async Logic) ---

// Register Admin (Used for initial setup)
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(USER_API_URL + 'register', user); 
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Login Admin
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        // Axios uses the fully constructed USER_API_URL for the POST request
        const response = await axios.post(USER_API_URL + 'login', user); 
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      } catch (error) {
        // Robust error extraction handles CORS and API failures
        return thunkAPI.rejectWithValue(extractErrorMessage(error));
      }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        logout: (state) => {
            localStorage.removeItem('user');
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- LOGIN ---
            .addCase(login.pending, (state) => { state.isLoading = true; })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false; state.isSuccess = true; state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
            })
            // --- REGISTER ---
            .addCase(register.pending, (state) => { state.isLoading = true; })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false; state.isSuccess = true; state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
            });
    }
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;