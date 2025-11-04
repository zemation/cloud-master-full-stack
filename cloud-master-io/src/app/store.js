// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
// NOTE: Explicitly adding .js extension to resolve potential path errors
import authReducer from '../features/auth/authSlice.js';
import navReducer from '../features/nav/navSlice.js';
import resourceReducer from '../features/resource/resourceSlice.js';

export const store = configureStore({
  reducer: {
    // Combine all slice reducers here
    auth: authReducer,     
    nav: navReducer,       
    resource: resourceReducer, 
  },
});