import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: (Option | string)[];
  error?: string;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={props.id || props.name}>
        {label}
      </label>
      <select
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'}
          bg-white
          text-gray-900
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-opacity-20
          transition duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none
          bg-no-repeat bg-right
          bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8l4 4 4-4" stroke="%236B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')]
          bg-[length:20px_20px]
          pr-10
        `}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => {
          const value = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option : option.label;
          return (
            <option key={index} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField; 