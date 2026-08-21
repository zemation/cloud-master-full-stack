// src/components/ui/Card.jsx

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        field-card
        ${onClick ? 'cursor-pointer hover:border-blue-500 transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;