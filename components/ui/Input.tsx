import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  const inputId =
    id || (typeof label === 'string' ? label.replace(/\s+/g, '-').toLowerCase() : '');

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-stone-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
