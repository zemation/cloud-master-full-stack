// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-gray-900 border-t border-gray-800 mt-auto'>
      <div className='container mx-auto px-4 max-w-7xl py-6'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          <Link to='/' className='text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors'>
            Cloud Master
          </Link>
          <p className='text-gray-400 text-sm'>
            A reference guide to training resources for computer industry topics and certifications.
          </p>
          <p className='text-gray-500 text-sm'>
            © {new Date().getFullYear()} Cloud Master. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
