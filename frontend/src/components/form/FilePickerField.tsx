import { isNil } from 'lodash';
import type { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  label: React.ReactNode;
  register: UseFormRegisterReturn;
  placeholder?: string;
  error?: React.ReactNode;
  accept?: string;
  previewImageUrl?: string;
  multiple?: boolean;
  disabled?: boolean;
};

export const FilePickerField = ({
  label,
  register,
  placeholder,
  error,
  accept = 'image/*',
  previewImageUrl,
  multiple = false,
  disabled = false,
}: Props) => {
  const hasError = !isNil(error);
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>

      {/* File input */}
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        placeholder={placeholder}
        className={`w-full text-xs file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0
      file:text-xs file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300
      ${hasError ? 'text-red-500' : 'text-gray-600'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
        disabled={disabled}
        {...register}
      />

      {/* Preview */}
      {!isNil(previewImageUrl) ? (
        <div
          className={`mt-2 rounded-xl overflow-hidden border
      ${hasError ? 'border-red-500' : 'border-gray-200'}
    `}
        >
          <img src={previewImageUrl} className="w-full h-40 object-cover" />
        </div>
      ) : null}

      {/* Error */}
      {hasError && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
