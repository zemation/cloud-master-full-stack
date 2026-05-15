// src/store/resourceSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as resourceApi from '../api/resourceApi';

const initialState = {
  resources: [],
  resource: null,
  certifications: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  total: 0,
  pages: 0,
  page: 1
};

// Get all resources
export const getResources = createAsyncThunk('resources/getAll', async (params, thunkAPI) => {
  try {
    return await resourceApi.getResources(params);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch resources');
  }
});

// Get single resource
export const getResource = createAsyncThunk('resources/getOne', async (id, thunkAPI) => {
  try {
    return await resourceApi.getResource(id);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch resource');
  }
});

// Get certifications
export const getCertifications = createAsyncThunk('resources/getCertifications', async (_, thunkAPI) => {
  try {
    return await resourceApi.getCertifications();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch certifications');
  }
});

// Create resource
export const createResource = createAsyncThunk('resources/create', async (resourceData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await resourceApi.createResource(resourceData, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to create resource');
  }
});

// Update resource
export const updateResource = createAsyncThunk('resources/update', async ({ id, resourceData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await resourceApi.updateResource(id, resourceData, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to update resource');
  }
});

// Delete resource
export const deleteResource = createAsyncThunk('resources/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await resourceApi.deleteResource(id, token);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to delete resource');
  }
});

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearResource: (state) => {
      state.resource = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all resources
      .addCase(getResources.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(getResources.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single resource
      .addCase(getResource.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resource = action.payload.data;
      })
      .addCase(getResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get certifications
      .addCase(getCertifications.fulfilled, (state, action) => {
        state.certifications = action.payload.data;
      })
      // Create resource
      .addCase(createResource.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resources.unshift(action.payload.data);
      })
      .addCase(createResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update resource
      .addCase(updateResource.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resources = state.resources.map(r =>
          r._id === action.payload.data._id ? action.payload.data : r
        );
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete resource
      .addCase(deleteResource.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resources = state.resources.filter(r => r._id !== action.payload);
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearResource } = resourceSlice.actions;
export default resourceSlice.reducer;