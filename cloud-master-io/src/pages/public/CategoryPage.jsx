// src/pages/public/CategoryPage.jsx

import { useParams, Link } from 'react-router-dom';
import { navigationMap } from '../../config/config';
import Card from '../../components/ui/Card';
import NotFoundPage from '../NotFoundPage';

const topicIcons = {
  'Hardware Essentials': '🖥️',
  'Introduction to Operating Systems': '💿',
  'Networking': '🌐',
  'Security': '🔒',
  'Linux': '🐧',
  'Windows': '🪟',
  'Mac': '🍎',
  'Containers': '📦',
  'Kubernetes': '⎈',
  'CI/CD': '🔄',
  'Automation & Scripting': '🤖',
  'Observability': '👁️',
  'Cloud Foundations': '☁️',
  'AWS': '🟠',
  'GCP': '🔵',
  'Azure': '🔷',
  'OpenStack': '🌩️',
  'Frontend': '🎨',
  'Backend': '⚙️',
  'Full Stack/Architecture': '🏗️',
  'Python': '🐍',
  'C Family': '©️',
  'Go': '🐹',
  'Java': '☕',
  'Relational': '📊',
  'Non-Relational': '📁',
};

const CategoryPage = () => {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const topics = navigationMap[decodedCategory];

  if (!topics) return <NotFoundPage />;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className='text-sm text-gray-400 mb-6'>
        <Link to='/' className='hover:text-white transition-colors'>Home</Link>
        <span className='mx-2'>/</span>
        <span className='text-white'>{decodedCategory}</span>
      </nav>

      {/* Header */}
      <div className='mb-10'>
        <h1 className='text-3xl font-bold text-white mb-2'>{decodedCategory}</h1>
        <p className='text-gray-400'>
          {topics.length} topics available — select one to browse resources.
        </p>
      </div>

      {/* Topics grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {topics.map((topic) => (
          <Link
            key={topic}
            to={`/category/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(topic)}`}
          >
            <Card className='h-full hover:border-blue-500 transition-colors'>
              <div className='text-3xl mb-3'>{topicIcons[topic] || '📚'}</div>
              <h3 className='text-white font-semibold'>{topic}</h3>
              <p className='text-gray-400 text-sm mt-1'>Browse resources →</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;