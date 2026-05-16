// src/components/layout/Header.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { navigationMap } from '../../config/config';
import logo from '../../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className='bg-gray-900 border-b border-gray-800'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Top bar */}
        <div className='flex items-center justify-between h-16'>
          <Link
            to='/'
            className='flex items-center gap-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors'
          >
            <img src={logo} alt='Cloud Master Logo' className='h-8 w-auto' />
            Cloud Master
          </Link>

          {/* Desktop nav */}
          <nav className='hidden md:flex items-center gap-4'>
            <Link
              to='/resources'
              className='text-gray-300 hover:text-white transition-colors text-sm'
            >
              All Resources
            </Link>

            {user?.user?.role === 'admin' && (
              <Link
                to='/admin'
                className='text-gray-300 hover:text-white transition-colors text-sm'
              >
                Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className='bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors'
              >
                Logout
              </button>
            ) : (
              <Link
                to='/login'
                className='bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors'
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className='md:hidden text-gray-300 hover:text-white p-2'
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label='Toggle menu'
          >
            {menuOpen ? (
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            ) : (
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop category nav */}
        <nav className='hidden md:flex gap-6 overflow-x-auto pb-3 scrollbar-hide'>
          {Object.keys(navigationMap).map((category) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
              className='text-gray-400 hover:text-blue-400 transition-colors text-sm whitespace-nowrap'
            >
              {category}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className='md:hidden border-t border-gray-800 py-4 space-y-1'>
            {/* Categories */}
            <p className='text-gray-500 text-xs uppercase tracking-wider px-2 mb-2'>Browse</p>
            {Object.keys(navigationMap).map((category) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                onClick={() => setMenuOpen(false)}
                className='block px-2 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm'
              >
                {category}
              </Link>
            ))}

            <div className='border-t border-gray-800 mt-3 pt-3 space-y-1'>
              <Link
                to='/resources'
                onClick={() => setMenuOpen(false)}
                className='block px-2 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm'
              >
                All Resources
              </Link>

              {user?.user?.role === 'admin' && (
                <Link
                  to='/admin'
                  onClick={() => setMenuOpen(false)}
                  className='block px-2 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm'
                >
                  Admin
                </Link>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-2 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm'
                >
                  Logout
                </button>
              ) : (
                <Link
                  to='/login'
                  onClick={() => setMenuOpen(false)}
                  className='block px-2 py-2 text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors text-sm'
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
