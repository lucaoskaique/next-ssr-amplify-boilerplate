import { HTMLProps, ReactNode } from 'react';

export type InputProps = HTMLProps<HTMLInputElement> & {
  invalid?: boolean;
  rightElement?: ReactNode;
};

export default function Input({
  invalid,
  label,
  rightElement,
  ...rest
}: InputProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <div className="text-lg">{label}</div>}
      <div
        className={`
        relative
        flex
        flex-row
        items-center
        rounded-full
        shadow-md
        disabled:shadow-none
        disabled:text-text-disabled
        border
        hover:border-primary-100
        focus:border-primary-300
        overflow-hidden
        bg-white
        ${invalid ? 'border border-red-400 bg-red-50' : 'border-white'}`}
      >
        <input {...rest} className="outline-none py-3 px-6 w-full" />
        {rightElement && (
          <div className="flex flex-row items-center pr-4">{rightElement}</div>
        )}
      </div>
    </div>
  );
}
