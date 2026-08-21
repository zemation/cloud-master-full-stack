// src/pages/public/CategoryPage.jsx

import { useParams, Link } from 'react-router-dom';
import { navigationMap } from '../../config/config';
import NotFoundPage from '../NotFoundPage';

const CategoryPage = () => {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const topics = navigationMap[decodedCategory];

  if (!topics) return <NotFoundPage />;

  return (
    <div className='category-page'>
      {/* Breadcrumb */}
      <nav className='text-sm text-gray-400 mb-6'>
        <Link to='/' className='hover:text-white transition-colors'>Home</Link>
        <span className='mx-2'>/</span>
        <span className='text-white'>{decodedCategory}</span>
      </nav>

      {/* Header */}
      <div className='mb-10'>
        <p className='eyebrow mb-3'>Domain index</p>
        <h1 className='text-4xl font-semibold text-white mb-2'>{decodedCategory}</h1>
        <p className='text-gray-400'>
          {topics.length} topics available — select one to browse resources.
        </p>
      </div>

      {/* Topics grid */}
      <div className='category-grid'>
        {topics.map((topic, index) => (
          <Link
            key={topic}
            to={`/category/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(topic)}`}
            className='category-tile field-card'
          >
            <div>
              <span className='category-index'>0{index + 1} / TOPIC</span>
              <h3>{topic}</h3>
              <p>Browse the available resources</p>
            </div>
            <span className='category-arrow' aria-hidden='true'>↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
