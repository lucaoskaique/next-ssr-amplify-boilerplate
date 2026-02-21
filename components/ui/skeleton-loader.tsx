import React from 'react';
import { cn } from '@/utils/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-gray-100">
          <div className="aspect-[16/9] relative overflow-hidden">
            <div className="w-full h-full bg-gray-200/60 animate-pulse" />
          </div>
          <div className="p-3">
            <div className="h-5 bg-gray-200/60 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
