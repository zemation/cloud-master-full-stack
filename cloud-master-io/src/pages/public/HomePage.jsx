// src/pages/public/HomePage.jsx

import { Link } from 'react-router-dom';
import { navigationMap } from '../../config/config';
import Card from '../../components/ui/Card';

const categoryIcons = {
  'Foundations': '🏗️',
  'Operating Systems': '💻',
  'DevOps': '⚙️',
  'Cloud': '☁️',
  'Web Development': '🌐',
  'Programming': '👨‍💻',
  'Databases': '🗄️',
};

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className='text-center py-16'>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
          Your Guide to{' '}
          <span className='text-blue-400'>Tech Certifications</span>
        </h1>
        <p className='text-gray-400 text-lg max-w-2xl mx-auto mb-8'>
          Curated training resources for computer industry topics and certifications.
          Find courses, study guides, practice exams and more.
        </p>
        <Link
          to='/resources'
          className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors'
        >
          Browse All Resources
        </Link>
      </section>

      {/* Categories grid */}
      <section>
        <h2 className='text-xl font-semibold text-white mb-6'>Browse by Category</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {Object.entries(navigationMap).map(([category, topics]) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
            >
              <Card className='h-full hover:border-blue-500 transition-colors'>
                <div className='text-3xl mb-3'>{categoryIcons[category] || '📚'}</div>
                <h3 className='text-white font-semibold mb-2'>{category}</h3>
                <p className='text-gray-400 text-sm'>
                  {topics.slice(0, 3).join(', ')}
                  {topics.length > 3 && ` +${topics.length - 3} more`}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;