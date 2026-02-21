'use client';

import { useState } from 'react';
import { cn } from '@/utils/utils';
import { AgeRating } from '@/types/client';
import { filterOptions } from '@/utils/filterUtils';

interface HatchedRatingButtonProps {
  onChange?: (ratings: string[]) => void;
  defaultSelected?: string[];
  showAllRatings?: boolean;
  className?: string;
}

export default function HatchedRatingButton({
  onChange,
  defaultSelected = [AgeRating.PG],
  showAllRatings = false,
  className,
}: HatchedRatingButtonProps) {
  const [selectedRatings, setSelectedRatings] =
    useState<string[]>(defaultSelected);

  const displayRatings = filterOptions.ageRating;

  const toggleRating = (rating: string) => {
    let newSelectedRatings: string[];

    if (selectedRatings.includes(rating)) {
      newSelectedRatings = selectedRatings.filter(r => r !== rating);
    } else {
      newSelectedRatings = [...selectedRatings, rating];
    }

    setSelectedRatings(newSelectedRatings);
    onChange?.(newSelectedRatings);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center bg-white border-2 border-gray-300 rounded-full shadow-sm w-full justify-center gap-[1px]',
        className,
      )}
    >
      {displayRatings.map((rating, index) => (
        <div key={rating} className="flex grow items-center w-full basis-0">
          {index > 0 && <div className="h-full w-px bg-gray-200"></div>}

          <button
            onClick={() => toggleRating(rating)}
            className={cn(
              'px-4 py-2 w-full h-full flex items-center justify-center transition-colors relative',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 ',
              `${index === 0 ? 'rounded-bl-full rounded-tl-full' : ''}`,
              `${index === displayRatings.length - 1 ? 'rounded-br-full rounded-tr-full' : ''}`,
              selectedRatings.includes(rating)
                ? 'bg-gray-400 text-white font-medium'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            {rating}

            {selectedRatings.includes(rating) && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundSize: '12px 12px',
                  opacity: 0.15,
                }}
              ></div>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
