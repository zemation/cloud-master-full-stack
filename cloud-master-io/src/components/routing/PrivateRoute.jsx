// src/components/routing/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  // Access the 'user' state from the authSlice
  const { user } = useSelector((state) => state.auth); 
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;