// src/pages/public/ResourcesPage.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResources } from '../../store/resourceSlice';
import { navigationMap, RESOURCE_TYPES, DIFFICULTY_LEVELS } from '../../config/config';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

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
    sort: '',
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
    setFilters({ search: '', category: '', topic: '', resourceType: '', difficulty: '', isFree: '', sort: '' });
    setAppliedFilters({});
  };

  const handlePageChange = (newPage) => {
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
  };

  const availableTopics = filters.category ? navigationMap[filters.category] || [] : [];

  const inputClass = 'resource-input';
  const activeFilters = Object.entries(appliedFilters).filter(([key, value]) => key !== 'page' && value !== '');

  return (
    <div className='resource-page'>
      <div className='resource-heading'>
        <div>
          <p className='eyebrow mb-3'>The resource index</p>
          <h1 className='text-4xl font-semibold text-white mb-2'>All Resources</h1>
          <p className='text-gray-400'>A working library for your next technical deep dive.</p>
        </div>
        <div className='resource-count'><span>{total}</span><small>matching records</small></div>
      </div>

      <form onSubmit={handleSearch} className='resource-controls field-card mb-8'>
        <div className='resource-search-row'>
          <input
            type='text'
            name='search'
            value={filters.search}
            onChange={handleFilterChange}
            placeholder='Search by title or description...'
            className={`${inputClass} resource-search`}
          />
          <Button type='submit'>Search index <span aria-hidden='true'>↗</span></Button>
        </div>

        <div className='resource-filter-row'>
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
          <select name='sort' value={filters.sort} onChange={handleFilterChange} className={inputClass}>
            <option value=''>Newest first</option>
            <option value='views'>Most viewed</option>
          </select>
          <Button type='button' variant='secondary' onClick={handleReset}>Reset</Button>
        </div>
        {activeFilters.length > 0 && (
          <div className='active-filters'>
            <span className='active-label'>ACTIVE</span>
            {activeFilters.map(([key, value]) => <span className='filter-chip' key={key}>{key}: {value}</span>)}
          </div>
        )}
      </form>

      {/* Error */}
      {isError && (
        <div className='resource-error mb-6'>
          Failed to load resources. Please try again.
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <Spinner className='mt-20' size='lg' />
      ) : resources.length === 0 ? (
        <Card className='empty-state text-center py-12'>
          <span className='eyebrow'>No match</span>
          <p className='text-gray-400 mt-3'>No resources found matching your filters.</p>
        </Card>
      ) : (
        <>
          <div className='resource-grid'>
            {resources.map((resource) => (
              <a
                key={resource._id}
                href={resource.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Card className='resource-card h-full'>
                  <div className='resource-card-top'>
                    <span className='resource-type'>{resource.resourceType}</span>
                    {resource.isFree ? (
                      <span className='resource-price free'>FREE</span>
                    ) : (
                      <span className='resource-price'>PAID</span>
                    )}
                  </div>
                  <h3 className='resource-title'>
                      {resource.title}
                  </h3>

                  {resource.description && (
                    <p className='resource-description'>
                      {resource.description}
                    </p>
                  )}

                  <div className='resource-tags'>
                    {resource.difficulty && (
                      <Badge variant='gray'>{resource.difficulty}</Badge>
                    )}
                    {resource.certification && (
                      <Badge variant='purple'>{resource.certification}</Badge>
                    )}
                  </div>

                  <div className='resource-card-footer'>
                    <div><span className='footer-label'>SOURCE</span><p>{resource.provider}</p></div>
                    <span className='resource-link' aria-hidden='true'>↗</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className='pagination'>
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
