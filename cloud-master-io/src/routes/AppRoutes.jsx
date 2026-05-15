// src/routes/AppRoutes.jsx

import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PrivateRoute from './PrivateRoute';

// Public pages
import HomePage from '../pages/public/HomePage';
import CategoryPage from '../pages/public/CategoryPage';
import TopicPage from '../pages/public/TopicPage';
import ResourcesPage from '../pages/public/ResourcesPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin pages
import DashboardPage from '../pages/admin/DashboardPage';
import AddResourcePage from '../pages/admin/AddResourcePage';
import EditResourcePage from '../pages/admin/EditResourcePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/category/:category' element={<CategoryPage />} />
        <Route path='/category/:category/:topic' element={<TopicPage />} />
        <Route path='/resources' element={<ResourcesPage />} />
        <Route path='/login' element={<LoginPage />} />

        {/* Admin routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/admin' element={<DashboardPage />} />
          <Route path='/admin/resources/add' element={<AddResourcePage />} />
          <Route path='/admin/resources/edit/:id' element={<EditResourcePage />} />
        </Route>

        {/* 404 */}
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;