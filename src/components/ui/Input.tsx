import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  disabled = false,
  error
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors input-focus-effect ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        style={{
          '--tw-ring-color': error ? '#ef4444' : '#E87461'
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;