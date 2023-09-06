import React from 'react';

import { cn } from '@/lib/utils';

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  classNames?: {
    input?: string;
    label?: string;
    inputWrapper?: string;
  };
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
  size?: 'sm' | 'base';
  isDarkBg?: boolean;
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  classNames,
  id,
  name,
  type,
  required,
  variant,
  size,
  isDarkBg,
  disabled,
}) => {
  const inputClasses = cn(
    'border rounded px-3 py-2',
    classNames?.input,
    // Apply variant-specific classes
    variant === 'primary' && [
      'bg-primary-500 text-white',
      'border-primary-600 border',
      'hover:bg-primary-600 hover:text-white',
      'active:bg-primary-700',
      'disabled:bg-primary-700',
    ],
    variant === 'outline' && [
      'text-primary-500',
      'border-primary-500 border',
      'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
      isDarkBg &&
        'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
    ],
    variant === 'ghost' && [
      'text-primary-500',
      'shadow-none',
      'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
      isDarkBg &&
        'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
    ],
    variant === 'light' && [
      'bg-white text-gray-700',
      'border border-gray-300',
      'hover:text-dark hover:bg-gray-100',
      'active:bg-white/80 disabled:bg-gray-200',
    ],
    variant === 'dark' && [
      'bg-gray-900 text-white',
      'border border-gray-600',
      'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
    ],
    // Apply size-specific classes
    size === 'base' && ['px-3 py-1.5', 'text-sm md:text-base'],
    size === 'sm' && ['px-2 py-1', 'text-xs md:text-sm'],
    'disabled:cursor-not-allowed',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  return (
    <div className={classNames?.inputWrapper}>
      {label && <label className={cn(classNames?.label, 'mr-2')}>{label}</label>}
      <div className='flex flex-col items-start flex-start w-full'>
      <input
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e)}
        id={id}
        name={name}
        type={type || 'text'}
        required={required}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default Input;