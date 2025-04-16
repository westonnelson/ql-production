import React, { useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valid?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, valid, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input-field-container">
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <div className="input-wrapper">
        <input
          className={`form-input ${focused ? 'focused' : ''} ${valid ? 'valid' : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {valid && <span className="checkmark">✓</span>}
      </div>
      <style jsx>{`
        .input-field-container {
          margin-bottom: 1rem;
          width: 100%;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: all 0.2s;
          background-color: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
        }

        .form-input.focused {
          border-color: #4299e1;
        }

        .form-input.valid {
          border-color: #48bb78;
          padding-right: 2.5rem;
        }

        .checkmark {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #48bb78;
          font-weight: bold;
        }

        .form-input::placeholder {
          color: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default InputField; 