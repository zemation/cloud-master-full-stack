// src/pages/admin/DashboardPage.jsx

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResources, deleteResource, reset } from '../../store/resourceSlice';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const resourceTypeBadgeVariant = {
  course: 'blue',
  documentation: 'gray',
  'practice-exam': 'yellow',
  'study-guide': 'green',
  video: 'purple',
  book: 'gray',
  tool: 'red',
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { resources, isLoading, isError, message, total } = useSelector((state) => state.resources);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getResources({ limit: 100 }));
    return () => dispatch(reset());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      dispatch(deleteResource(id));
    }
  };

  if (isLoading) return <Spinner className='mt-20' size='lg' />;

  const published = resources.filter((r) => r.status === 'published').length;
  const drafts = resources.filter((r) => r.status === 'draft').length;

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-1'>Admin Dashboard</h1>
          <p className='text-gray-400'>Welcome back, {user?.user?.name}</p>
        </div>
        <Link to='/admin/resources/add'>
          <Button size='lg'>+ Add Resource</Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <Card>
          <p className='text-gray-400 text-sm mb-1'>Total Resources</p>
          <p className='text-3xl font-bold text-white'>{total}</p>
        </Card>
        <Card>
          <p className='text-gray-400 text-sm mb-1'>Published</p>
          <p className='text-3xl font-bold text-green-400'>{published}</p>
        </Card>
        <Card>
          <p className='text-gray-400 text-sm mb-1'>Drafts</p>
          <p className='text-3xl font-bold text-yellow-400'>{drafts}</p>
        </Card>
      </div>

      {isError && (
        <div className='bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm'>
          {message}
        </div>
      )}

      <Card className='p-0 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-800'>
                <th className='text-left text-gray-400 text-sm font-medium px-6 py-4'>Title</th>
                <th className='text-left text-gray-400 text-sm font-medium px-6 py-4'>Category / Topic</th>
                <th className='text-left text-gray-400 text-sm font-medium px-6 py-4'>Type</th>
                <th className='text-left text-gray-400 text-sm font-medium px-6 py-4'>Status</th>
                <th className='text-left text-gray-400 text-sm font-medium px-6 py-4'>Views</th>
                <th className='text-right text-gray-400 text-sm font-medium px-6 py-4'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-800'>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={6} className='text-center text-gray-400 py-12'>
                    No resources yet.{' '}
                    <Link to='/admin/resources/add' className='text-blue-400 hover:underline'>
                      Add your first one.
                    </Link>
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource._id} className='hover:bg-gray-800/50 transition-colors'>
                    <td className='px-6 py-4'>
                      <a
                        href={resource.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white text-sm font-medium hover:text-blue-400 transition-colors line-clamp-1'
                      >
                        {resource.title}
                      </a>
                      <p className='text-gray-500 text-xs mt-0.5'>{resource.provider}</p>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-gray-300 text-sm'>{resource.category}</p>
                      <p className='text-gray-500 text-xs mt-0.5'>{resource.topic}</p>
                    </td>
                    <td className='px-6 py-4'>
                      {resource.resourceType && (
                        <Badge variant={resourceTypeBadgeVariant[resource.resourceType] || 'gray'}>
                          {resource.resourceType}
                        </Badge>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <Badge variant={resource.status === 'published' ? 'green' : 'yellow'}>
                        {resource.status}
                      </Badge>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-gray-300 text-sm'>{resource.views || 0}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link to={`/admin/resources/edit/${resource._id}`}>
                          <Button variant='secondary' size='sm'>Edit</Button>
                        </Link>
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={() => handleDelete(resource._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
