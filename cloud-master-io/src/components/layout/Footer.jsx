// src/components/layout/Footer.jsx

const Footer = () => {
  return (
    <footer className='bg-gray-900 border-t border-gray-800 mt-auto'>
      <div className='container mx-auto px-4 max-w-7xl py-6'>
        <p className='text-gray-400 text-sm'>
          A reference guide to training resources for computer industry topics and certifications.
        </p>
        <hr className='border-gray-800 my-4' />
        <p className='text-gray-500 text-sm'>
          © {new Date().getFullYear()} Cloud Master. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;