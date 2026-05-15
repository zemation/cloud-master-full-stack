// src/components/ui/Card.jsx

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-900 border border-gray-800 rounded-xl p-6
        ${onClick ? 'cursor-pointer hover:border-blue-500 transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;