import Image from 'next/image';

const shared = 'py-3 px-6 rounded-full flex flex-row items-center gap-2';
const style = 'bg-primary-500 shadow text-white hover:bg-primary-400';
const loadingStyle = 'bg-primary-600 text-lighten-400';

export default function SubmitButton({
  loading,
  className,
  label,
  ...rest
}: {
  className?: string;
  label: string;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`${shared} ${loading ? loadingStyle : style} ${className}`}
      {...rest}
    >
      {label}
      {loading && (
        <Image
          src="/loader.png"
          width={20}
          height={20}
          alt="Loading..."
          unoptimized
        />
      )}
    </button>
  );
}
