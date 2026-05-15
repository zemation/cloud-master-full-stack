// src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../store/authSlice';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/admin');
    }
    return () => dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (isLoading) return <Spinner className='mt-20' size='lg' />;

  return (
    <div className='min-h-[70vh] flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-8'>
          <h1 className='text-2xl font-bold text-white mb-2'>Admin Login</h1>
          <p className='text-gray-400 text-sm mb-8'>Sign in to manage resources</p>

          {isError && (
            <div className='bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm'>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1.5'>
                Email
              </label>
              <input
                type='email'
                name='email'
                value={email}
                onChange={handleChange}
                required
                className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm'
                placeholder='admin@example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1.5'>
                Password
              </label>
              <input
                type='password'
                name='password'
                value={password}
                onChange={handleChange}
                required
                className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm'
                placeholder='••••••••'
              />
            </div>

            <Button type='submit' className='w-full' size='lg' disabled={isLoading}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;