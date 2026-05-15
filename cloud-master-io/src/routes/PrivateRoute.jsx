// src/routes/PrivateRoute.jsx

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (user.user?.role !== 'admin') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;