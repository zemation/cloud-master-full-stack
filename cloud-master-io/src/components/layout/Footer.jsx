// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';
import { navigationMap } from '../../config/config';

const Footer = () => {
  return (
    <footer className='bg-gray-900 border-t border-gray-800 mt-auto'>
      <div className='container mx-auto px-4 max-w-7xl py-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='col-span-2 md:col-span-1'>
            <Link to='/' className='text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors'>
              Cloud Master
            </Link>
            <p className='mt-3 text-gray-400 text-sm'>
              A reference guide to training resources for computer industry topics and certifications.
            </p>
          </div>

          {/* Categories */}
          {Object.entries(navigationMap).slice(0, 3).map(([category, topics]) => (
            <div key={category}>
              <Link
                to={`/category/${encodeURIComponent(category)}`}
                className='text-white font-semibold text-sm hover:text-blue-400 transition-colors'
              >
                {category}
              </Link>
              <ul className='mt-3 space-y-2'>
                {topics.slice(0, 4).map((topic) => (
                  <li key={topic}>
                    <Link
                      to={`/category/${encodeURIComponent(category)}/${encodeURIComponent(topic)}`}
                      className='text-gray-400 hover:text-gray-200 text-sm transition-colors'
                    >
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm'>
          © {new Date().getFullYear()} Cloud Master. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;