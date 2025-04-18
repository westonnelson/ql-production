import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={props.id || props.name}>
        {label}
      </label>
      <input
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
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField; 