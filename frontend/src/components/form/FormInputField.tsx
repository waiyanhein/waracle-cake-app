import { isNil } from 'lodash';
import type React from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  label: React.ReactNode;
  register: UseFormRegisterReturn;
  placeholder?: string;
  error?: React.ReactNode;
  disabled?: boolean;
};

export const FormInputField = ({
  register,
  label,
  placeholder,
  error,
  disabled = false,
}: Props) => {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full text-sm px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:outline-none transition
            ${
              !isNil(error)
                ? 'border border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border border-gray-200 focus:ring-2 focus:ring-black/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        disabled={disabled}
        {...register}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
