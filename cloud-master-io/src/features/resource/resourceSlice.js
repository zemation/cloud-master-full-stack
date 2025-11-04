// src/features/resource/resourceSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_ROOT_URL } from '../../config/config.js'; 

const RESOURCE_API_URL = `${API_ROOT_URL}resources`; 
const API_TIMEOUT = 10000; // ⬅️ DEFINITIVE FIX: 10 seconds timeout ⬅️

const initialState = {
  resources: [],
  selectedResource: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Helper function for Authorization Header
const config = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
    timeout: API_TIMEOUT
});

// Helper function to extract error message
const extractErrorMessage = (error) => 
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();

// ===========================================
// ASYNC THUNKS (API Calls)
// ===========================================

// @desc    GET /api/resources (Modified to handle optional token)
export const getResources = createAsyncThunk(
    'resource/getAll',
    async (query, thunkAPI) => {
        try {
            const { token, ...filterParams } = query || {}; 

            // Pass the token config or a generic config with the timeout
            const fetchConfig = token ? config(token) : { timeout: API_TIMEOUT };

            const queryString = new URLSearchParams(filterParams).toString();
            
            const response = await axios.get(RESOURCE_API_URL + (queryString ? `?${queryString}` : ''), fetchConfig);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error));
        }
    }
);

// @desc    POST /api/resources (Protected)
export const createResource = createAsyncThunk(
    'resource/create',
    async ({ payload, token }, thunkAPI) => {
        try {
            const response = await axios.post(RESOURCE_API_URL, payload, config(token));
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error));
        }
    }
);

// @desc    DELETE /api/resources/:id (Protected)
export const deleteResource = createAsyncThunk(
    'resource/delete',
    async ({ id, token }, thunkAPI) => {
        try {
            const response = await axios.delete(`${RESOURCE_API_URL}/${id}`, config(token));
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error));
        }
    }
);

// @desc    GET /api/resources/:id (Required for EditResourcePage)
export const getResourceById = createAsyncThunk(
    'resource/getOne',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${RESOURCE_API_URL}/${id}`, { timeout: API_TIMEOUT }); // Using generic timeout config
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error));
        }
    }
);

// @desc    PUT /api/resources/:id (Protected)
export const updateResource = createAsyncThunk(
    'resource/update',
    async ({ id, payload, token }, thunkAPI) => {
        try {
            const response = await axios.put(`${RESOURCE_API_URL}/${id}`, payload, config(token));
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(extractErrorMessage(error));
        }
    }
);


// ===========================================
// SLICE REDUCER LOGIC
// ===========================================

export const resourceSlice = createSlice({
    name: 'resource',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // --- CREATE ---
            .addCase(createResource.pending, (state) => { state.isLoading = true; })
            .addCase(createResource.fulfilled, (state, action) => {
                state.isLoading = false; state.isSuccess = true; state.resources.push(action.payload);
            })
            .addCase(createResource.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            // --- GET ALL ---
            .addCase(getResources.pending, (state) => { state.isLoading = true; })
            .addCase(getResources.fulfilled, (state, action) => {
                state.isLoading = false; 
                state.isSuccess = true; 
                state.resources = action.payload; 
            })
            .addCase(getResources.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            // --- GET BY ID ---
            .addCase(getResourceById.pending, (state) => { state.isLoading = true; })
            .addCase(getResourceById.fulfilled, (state, action) => {
                state.isLoading = false; state.isSuccess = true; state.selectedResource = action.payload;
            })
            .addCase(getResourceById.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload; state.selectedResource = null;
            })
            // --- UPDATE ---
            .addCase(updateResource.fulfilled, (state, action) => {
                state.isLoading = false; state.isSuccess = true; 
                state.resources = state.resources.map(r => r._id === action.payload._id ? action.payload : r);
            })
            .addCase(updateResource.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            // --- DELETE ---
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.resources = state.resources.filter(
                    (resource) => resource._id !== action.payload.id
                );
            });
    },
});

export const { reset } = resourceSlice.actions;
export default resourceSlice.reducer;