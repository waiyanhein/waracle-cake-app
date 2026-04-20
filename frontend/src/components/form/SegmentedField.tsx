import { isNil } from 'lodash';

type Props = {
  label: React.ReactNode;
  options?: {
    label: React.ReactNode;
    value: number;
  }[];
  error?: React.ReactNode;
  onChange: (value: number) => void;
  value?: number;
  disabled?: boolean;
};

export const SegmentedField = ({
  label,
  error,
  onChange,
  value,
  disabled = false,
  options = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
  ],
}: Props) => {
  const hasError = !isNil(error);
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>

      <div className="flex gap-2">
        {options.map((option) => {
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 py-2 rounded-lg text-sm transition
            ${
              value === option.value
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
              disabled={disabled}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {hasError && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
