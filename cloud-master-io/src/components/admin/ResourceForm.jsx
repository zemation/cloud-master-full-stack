// src/components/admin/ResourceForm.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationMap, RESOURCE_TYPES, DIFFICULTY_LEVELS } from '../../config/config';
import Button from '../ui/Button';

const defaultFormData = {
  title: '',
  url: '',
  provider: '',
  category: '',
  topic: '',
  certification: '',
  resourceType: '',
  description: '',
  difficulty: 'beginner',
  isFree: true,
  status: 'draft',
};

const ResourceForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        url: initialData.url || '',
        provider: initialData.provider || '',
        category: initialData.category || '',
        topic: initialData.topic || '',
        certification: initialData.certification || '',
        resourceType: initialData.resourceType || '',
        description: initialData.description || '',
        difficulty: initialData.difficulty || 'beginner',
        isFree: initialData.isFree ?? true,
        status: initialData.status || 'draft',
      });
    }
  }, [initialData]);

  const availableTopics = formData.category ? navigationMap[formData.category] || [] : [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category' && { topic: '' }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Title */}
      <div>
        <label className={labelClass}>Title <span className='text-red-400'>*</span></label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
          placeholder='e.g. AWS Solutions Architect Course'
          className={inputClass}
        />
      </div>

      {/* URL */}
      <div>
        <label className={labelClass}>URL <span className='text-red-400'>*</span></label>
        <input
          type='url'
          name='url'
          value={formData.url}
          onChange={handleChange}
          required
          placeholder='https://...'
          className={inputClass}
        />
      </div>

      {/* Provider */}
      <div>
        <label className={labelClass}>Provider <span className='text-red-400'>*</span></label>
        <input
          type='text'
          name='provider'
          value={formData.provider}
          onChange={handleChange}
          required
          placeholder='e.g. Udemy, A Cloud Guru, Linux Foundation'
          className={inputClass}
        />
      </div>

      {/* Category / Topic */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className={labelClass}>Category <span className='text-red-400'>*</span></label>
          <select
            name='category'
            value={formData.category}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value=''>Select a category</option>
            {Object.keys(navigationMap).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Topic <span className='text-red-400'>*</span></label>
          <select
            name='topic'
            value={formData.topic}
            onChange={handleChange}
            required
            disabled={!formData.category}
            className={`${inputClass} disabled:opacity-50`}
          >
            <option value=''>Select a topic</option>
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Type / Difficulty */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className={labelClass}>Resource Type <span className='text-red-400'>*</span></label>
          <select
            name='resourceType'
            value={formData.resourceType}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value=''>Select a type</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Difficulty</label>
          <select
            name='difficulty'
            value={formData.difficulty}
            onChange={handleChange}
            className={inputClass}
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Certification */}
      <div>
        <label className={labelClass}>Certification</label>
        <input
          type='text'
          name='certification'
          value={formData.certification}
          onChange={handleChange}
          placeholder='e.g. AWS Solutions Architect, CKA, AZ-900'
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder='Brief description of this resource...'
          className={inputClass}
        />
      </div>

      {/* isFree / Status */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className={labelClass}>Status</label>
          <select
            name='status'
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value='draft'>Draft</option>
            <option value='published'>Published</option>
          </select>
        </div>

        <div className='flex items-center gap-3 mt-6'>
          <input
            type='checkbox'
            name='isFree'
            id='isFree'
            checked={formData.isFree}
            onChange={handleChange}
            className='w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500'
          />
          <label htmlFor='isFree' className='text-sm text-gray-300'>
            Free resource
          </label>
        </div>
      </div>

      {/* Submit / Cancel */}
      <div className='flex gap-3 pt-2'>
        <Button type='submit' size='lg' disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Resource'}
        </Button>
        <Button type='button' variant='secondary' size='lg' onClick={() => navigate('/admin')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
