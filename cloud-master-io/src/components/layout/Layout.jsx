// src/components/layout/Layout.jsx

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col bg-gray-950 text-gray-100'>
      <Header />
      <main className='flex-1 container mx-auto px-4 py-8 max-w-7xl'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;