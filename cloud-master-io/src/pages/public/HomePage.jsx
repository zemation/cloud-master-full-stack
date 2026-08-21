// src/pages/public/HomePage.jsx

import { Link } from 'react-router-dom';
import { navigationMap } from '../../config/config';
import Button from '../../components/ui/Button';
import heroImage from '../../assets/hero.png';

const HomePage = () => {
  const categories = Object.entries(navigationMap);

  return (
    <div className='home-page'>
      <section className='hero-panel'>
        <div className='hero-aside' aria-hidden='true'>
          <img src={heroImage} alt='' />
        </div>
        <p className='hero-kicker'>Independent learning, indexed</p>
        <h1 className='hero-title'>
          Find the next <em>signal</em> in your tech career.
        </h1>
        <p className='hero-copy'>
          A considered collection of courses, documentation, books, and practice material for the people building what comes next.
        </p>
        <div className='hero-actions'>
          <Link to='/resources'><Button size='lg'>Explore the index <span aria-hidden='true'>↗</span></Button></Link>
          <Link to='/category/Cloud'><Button variant='secondary' size='lg'>Start with Cloud</Button></Link>
        </div>
        <div className='hero-meta'>
          <div><span className='meta-value'>07</span><span className='meta-label'>domains</span></div>
          <div><span className='meta-value'>30+</span><span className='meta-label'>topics mapped</span></div>
          <div><span className='meta-value'>01</span><span className='meta-label'>clean starting point</span></div>
        </div>
      </section>

      <section>
        <div className='section-heading'>
          <div>
            <p className='eyebrow mb-2'>The map</p>
            <h2>Choose a domain to investigate</h2>
          </div>
          <p>CURATED / OPEN / USEFUL</p>
        </div>
        <div className='category-grid'>
          {categories.map(([category, topics], index) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
              className='category-tile field-card'
            >
              <div>
                <span className='category-index'>0{index + 1} / DOMAIN</span>
                <h3>{category}</h3>
                <p>{topics.length} mapped topics · {topics.slice(0, 2).join(' · ')}</p>
              </div>
              <span className='category-arrow' aria-hidden='true'>↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
