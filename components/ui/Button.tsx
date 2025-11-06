
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'md', ...props }) => {
  const baseStyles = 'font-bold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4';

  const variantStyles = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500/50',
    ghost: 'bg-transparent text-red-500 hover:bg-red-500/10 focus:ring-red-500/30',
  };

  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-2.5 px-6 text-base',
    lg: 'py-3 px-8 text-lg font-heading tracking-wider',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
