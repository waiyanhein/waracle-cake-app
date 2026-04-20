import { isNil } from 'lodash';
import type { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  label: React.ReactNode;
  register: UseFormRegisterReturn;
  placeholder?: string;
  error?: React.ReactNode;
  disabled?: boolean;
};

export const FormTextarea = ({
  label,
  register,
  placeholder,
  error,
  disabled = false,
}: Props) => {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>

      <textarea
        maxLength={200}
        rows={3}
        placeholder={placeholder}
        className={`w-full text-sm px-3 py-2 rounded-lg focus:outline-none transition resize-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${
        !isNil(error)
          ? 'border border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20'
          : 'border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/20'
      }
    `}
        disabled={disabled}
        {...register}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
