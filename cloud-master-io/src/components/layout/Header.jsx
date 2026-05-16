// src/components/layout/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { navigationMap } from '../../config/config';
import logo from '../../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className='bg-gray-900 border-b border-gray-800'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Top bar */}
        <div className='flex items-center justify-between h-16'>
          <Link to='/' className='flex items-center gap-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors'>
            <img src={logo} alt='Cloud Master Logo' className='h-8 w-auto' />
            Cloud Master
          </Link>

          <nav className='flex items-center gap-4'>
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
        </div>

        {/* Category nav */}
        <nav className='flex gap-6 overflow-x-auto pb-3 scrollbar-hide'>
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
      </div>
    </header>
  );
};

export default Header;
