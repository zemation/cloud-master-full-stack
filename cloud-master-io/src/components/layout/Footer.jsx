// src/components/layout/Footer.jsx

const Footer = () => {
  return (
    <footer className='site-footer mt-auto'>
      <div className='container mx-auto px-4 max-w-7xl py-7 text-center'>
        <p className='text-teal-300 font-semibold text-sm'>
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
