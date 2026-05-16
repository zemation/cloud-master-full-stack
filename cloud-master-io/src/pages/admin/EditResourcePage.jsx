// src/pages/admin/EditResourcePage.jsx

import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResource, updateResource, reset, clearResource } from '../../store/resourceSlice';
import ResourceForm from '../../components/admin/ResourceForm';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

const EditResourcePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resource, isLoading, isError, isSuccess, message } = useSelector((state) => state.resources);

  useEffect(() => {
    dispatch(getResource(id));
    return () => {
      dispatch(reset());
      dispatch(clearResource());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate('/admin');
    }
  }, [isSuccess, dispatch, navigate]);

  const handleSubmit = (formData) => {
    dispatch(updateResource({ id, resourceData: formData }));
  };

  if (isLoading && !resource) return <Spinner className='mt-20' size='lg' />;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className='text-sm text-gray-400 mb-6'>
        <Link to='/admin' className='hover:text-white transition-colors'>Dashboard</Link>
        <span className='mx-2'>/</span>
        <span className='text-white'>Edit Resource</span>
      </nav>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>Edit Resource</h1>
        <p className='text-gray-400'>Update an existing training resource.</p>
      </div>

      {isError && (
        <div className='bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm'>
          {message}
        </div>
      )}

      <Card>
        <ResourceForm
          onSubmit={handleSubmit}
          initialData={resource}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default EditResourcePage;