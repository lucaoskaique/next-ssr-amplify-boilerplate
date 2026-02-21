import { ReactNode } from 'react';
import Image from 'next/image';

export default function TodayBox({
  label,
  className,
  imageUrl,
  value,
  nativeImage = false,
  icon,
}: {
  label: string;
  className?: string;
  imageUrl: string;
  value: string;
  nativeImage?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      className={`h-20 p-4 rounded-2xl flex flex-row gap-4 items-center relative ${className}`}
    >
      {icon && <div className="absolute right-2 top-2">{icon}</div>}
      {nativeImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={label} width={32} height={32} />
      ) : (
        <Image src={imageUrl} alt={label} width={32} height={32} />
      )}
      <div className="flex flex-col">
        <div className="text-dashboard-primary text-sm">{label}</div>
        <div className="text-2xl font-bold text-dashboard-primary">{value}</div>
      </div>
    </div>
  );
}
