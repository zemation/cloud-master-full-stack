// src/components/layout/Layout.jsx

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../chat/ChatWidget';

const Layout = () => {
  return (
    <div className='site-shell min-h-screen flex flex-col text-gray-100'>
      <Header />
      <main className='page-content flex-1 w-full'>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Layout;