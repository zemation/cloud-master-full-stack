// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className='min-h-[70vh] flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-8xl font-bold text-blue-400 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-white mb-3'>Page Not Found</h2>
        <p className='text-gray-400 mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to='/'>
          <Button size='lg'>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;