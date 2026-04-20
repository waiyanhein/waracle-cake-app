type CommonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  theme?: 'primary' | 'secondary';
  className?: string;
};

type ButtonProps = CommonProps & {
  type: 'button';
  onClick: () => void;
};

type SubmitProps = CommonProps & {
  type: 'submit';
};

type Props = ButtonProps | SubmitProps;

/**
 *
 * @param p flex-1 bg-gray-100 py-2 rounded-xl text-sm hover:bg-gray-200 transition
 * @returns
 */
export const Button = (p: Props) => {
  const theme = p.theme ?? 'primary';
  return (
    <button
      disabled={p.disabled}
      type={p.type}
      onClick={p.type === 'button' ? p.onClick : undefined}
      className={`text-sm ${theme === 'primary' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-3 py-1.5 rounded-lg hover:opacity-90 transition ${p.className}`}
    >
      {p.children}
    </button>
  );
};
