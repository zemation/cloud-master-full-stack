// src/components/layout/Layout.jsx

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='site-shell min-h-screen flex flex-col text-gray-100'>
      <Header />
      <main className='page-content flex-1 w-full'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;