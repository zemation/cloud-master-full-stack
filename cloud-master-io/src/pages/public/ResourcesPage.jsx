// src/pages/public/ResourcesPage.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResources } from '../../store/resourceSlice';
import { navigationMap, RESOURCE_TYPES, DIFFICULTY_LEVELS } from '../../config/config';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const resourceTypeBadgeVariant = {
  course: 'blue',
  documentation: 'gray',
  'practice-exam': 'yellow',
  'study-guide': 'green',
  video: 'purple',
  book: 'gray',
  tool: 'red',
};

const ResourcesPage = () => {
  const dispatch = useDispatch();
  const { resources, isLoading, isError, total, pages, page } = useSelector((state) => state.resources);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    topic: '',
    resourceType: '',
    difficulty: '',
    isFree: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    dispatch(getResources(appliedFilters));
  }, [dispatch, appliedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { topic: '' }),
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    );
  };

  const handleReset = () => {
    setFilters({ search: '', category: '', topic: '', resourceType: '', difficulty: '', isFree: '' });
    setAppliedFilters({});
  };

  const handlePageChange = (newPage) => {
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
  };

  const availableTopics = filters.category ? navigationMap[filters.category] || [] : [];

  const inputClass = 'bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm';

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>All Resources</h1>
        <p className='text-gray-400'>
          {total} resource{total !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className='bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          <input
            type='text'
            name='search'
            value={filters.search}
            onChange={handleFilterChange}
            placeholder='Search resources...'
            className={`${inputClass} col-span-full`}
          />

          <select name='category' value={filters.category} onChange={handleFilterChange} className={inputClass}>
            <option value=''>All Categories</option>
            {Object.keys(navigationMap).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            name='topic'
            value={filters.topic}
            onChange={handleFilterChange}
            disabled={!filters.category}
            className={`${inputClass} disabled:opacity-50`}
          >
            <option value=''>All Topics</option>
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <select name='resourceType' value={filters.resourceType} onChange={handleFilterChange} className={inputClass}>
            <option value=''>All Types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select name='difficulty' value={filters.difficulty} onChange={handleFilterChange} className={inputClass}>
            <option value=''>All Levels</option>
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select name='isFree' value={filters.isFree} onChange={handleFilterChange} className={inputClass}>
            <option value=''>Free and Paid</option>
            <option value='true'>Free Only</option>
            <option value='false'>Paid Only</option>
          </select>
        </div>

        <div className='flex gap-3'>
          <Button type='submit'>Search</Button>
          <Button type='button' variant='secondary' onClick={handleReset}>Reset</Button>
        </div>
      </form>

      {/* Error */}
      {isError && (
        <div className='bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm'>
          Failed to load resources. Please try again.
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <Spinner className='mt-20' size='lg' />
      ) : resources.length === 0 ? (
        <Card className='text-center py-12'>
          <p className='text-gray-400'>No resources found matching your filters.</p>
        </Card>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {resources.map((resource) => (
              <a
                key={resource._id}
                href={resource.url}
                target='_blank'
                rel='noopener noreferrer'
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

                  <div className='flex flex-wrap gap-2'>
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

                  <div className='flex items-center justify-between mt-4'>
                    <p className='text-gray-500 text-xs'>{resource.provider}</p>
                    <p className='text-gray-500 text-xs'>{resource.category} / {resource.topic}</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className='flex justify-center gap-2 mt-8'>
              <Button
                variant='secondary'
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <span className='flex items-center text-gray-400 text-sm px-4'>
                Page {page} of {pages}
              </span>
              <Button
                variant='secondary'
                disabled={page === pages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourcesPage;
