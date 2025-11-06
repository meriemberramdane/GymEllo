import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  const selectId = id || label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <select
        id={selectId}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
