// src/pages/public/TopicPage.jsx

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResources } from '../../store/resourceSlice';
import { incrementViews } from '../../api/resourceApi';
import { navigationMap } from '../../config/config';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import NotFoundPage from '../NotFoundPage';

const resourceTypeBadgeVariant = {
  course: 'blue',
  documentation: 'gray',
  'practice-exam': 'yellow',
  'study-guide': 'green',
  video: 'purple',
  book: 'gray',
  tool: 'red',
};

const TopicPage = () => {
  const { category, topic } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const decodedTopic = decodeURIComponent(topic);

  const dispatch = useDispatch();
  const { resources, isLoading, isError } = useSelector((state) => state.resources);

  const topics = navigationMap[decodedCategory];
  const isValidTopic = topics?.includes(decodedTopic);

  useEffect(() => {
    if (isValidTopic) {
      dispatch(getResources({ category: decodedCategory, topic: decodedTopic }));
    }
  }, [dispatch, decodedCategory, decodedTopic, isValidTopic]);

  if (!isValidTopic) return <NotFoundPage />;
  if (isLoading) return <Spinner className='mt-20' size='lg' />;

  const handleResourceClick = (id) => {
    incrementViews(id).catch(() => { });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className='text-sm text-gray-400 mb-6'>
        <Link to='/' className='hover:text-white transition-colors'>Home</Link>
        <span className='mx-2'>/</span>
        <Link
          to={`/category/${encodeURIComponent(decodedCategory)}`}
          className='hover:text-white transition-colors'
        >
          {decodedCategory}
        </Link>
        <span className='mx-2'>/</span>
        <span className='text-white'>{decodedTopic}</span>
      </nav>

      {/* Header */}
      <div className='mb-10'>
        <h1 className='text-3xl font-bold text-white mb-2'>{decodedTopic}</h1>
        <p className='text-gray-400'>
          {resources.length} resource{resources.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className='bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm'>
          Failed to load resources. Please try again.
        </div>
      )}

      {/* Resources */}
      {resources.length === 0 && !isLoading ? (
        <Card className='text-center py-12'>
          <p className='text-gray-400'>No resources found for this topic yet.</p>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {resources.map((resource) => (
            <a
              key={resource._id}
              href={resource.url}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => handleResourceClick(resource._id)}
            >
              <Card className='h-full hover:border-blue-500 transition-colors'>
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <h3 className='text-white font-semibold text-sm leading-snug'>
                    {resource.title}
                  </h3>
                  {resource.isFree ? (
                    <Badge variant='green'>Free</Badge>
                  ) : (
                    <Badge variant='yellow'>Paid</Badge>
                  )}
                </div>

                {resource.description && (
                  <p className='text-gray-400 text-sm mb-4 line-clamp-2'>
                    {resource.description}
                  </p>
                )}

                <div className='flex flex-wrap gap-2 mt-auto'>
                  {resource.resourceType && (
                    <Badge variant={resourceTypeBadgeVariant[resource.resourceType] || 'gray'}>
                      {resource.resourceType}
                    </Badge>
                  )}
                  {resource.difficulty && (
                    <Badge variant='gray'>{resource.difficulty}</Badge>
                  )}
                  {resource.certification && (
                    <Badge variant='purple'>{resource.certification}</Badge>
                  )}
                </div>

                <p className='text-gray-500 text-xs mt-4'>{resource.provider}</p>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicPage;
