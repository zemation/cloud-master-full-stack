// src/index.js (Final Check)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; 
import App from './App.jsx'; 
import { store } from './app/store.js'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // ⬅️ IMPORTANT: Wrap the entire app in the Redux Provider ⬅️
  <React.StrictMode> 
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);