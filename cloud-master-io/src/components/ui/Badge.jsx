// src/components/ui/Badge.jsx

const variants = {
  blue: 'bg-blue-900/50 text-blue-300 border border-blue-800',
  green: 'bg-green-900/50 text-green-300 border border-green-800',
  yellow: 'bg-yellow-900/50 text-yellow-300 border border-yellow-800',
  red: 'bg-red-900/50 text-red-300 border border-red-800',
  gray: 'bg-gray-800 text-gray-300 border border-gray-700',
  purple: 'bg-purple-900/50 text-purple-300 border border-purple-800',
};

const Badge = ({ children, variant = 'gray', className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;