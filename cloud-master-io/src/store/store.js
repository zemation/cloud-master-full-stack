// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import resourceReducer from './resourceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resources: resourceReducer,
  },
});