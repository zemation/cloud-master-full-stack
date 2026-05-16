// src/pages/admin/AddResourcePage.jsx

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createResource, reset } from '../../store/resourceSlice';
import ResourceForm from '../../components/admin/ResourceForm';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AddResourcePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.resources);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate('/admin');
    }
    return () => dispatch(reset());
  }, [isSuccess, dispatch, navigate]);

  const handleSubmit = (formData) => {
    dispatch(createResource(formData));
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className='text-sm text-gray-400 mb-6'>
        <Link to='/admin' className='hover:text-white transition-colors'>Dashboard</Link>
        <span className='mx-2'>/</span>
        <span className='text-white'>Add Resource</span>
      </nav>

      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-2'>Add Resource</h1>
          <p className='text-gray-400'>Add a new training resource to the site.</p>
        </div>
        <Button variant='secondary' onClick={() => navigate('/admin')}>Cancel</Button>
      </div>

      {isError && (
        <div className='bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm'>
          {message}
        </div>
      )}

      <Card>
        <ResourceForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default AddResourcePage;
