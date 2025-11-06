
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const cardClassName = `
    bg-gray-900/50 
    backdrop-blur-md 
    border 
    border-gray-700/50 
    rounded-2xl 
    p-6 
    shadow-lg 
    transition-all 
    duration-300 
    hover:border-gray-600/70
    hover:shadow-red-500/10
    ${className}
  `;
  return (
    <div className={cardClassName}>
      {children}
    </div>
  );
};

export default Card;
