import { MaxAgeRatingFilter } from '@/types/client';
import { Slider } from '@/components/ui/slider';
import { filterOptions } from '@/utils/filterUtils';
import { useEffect, useState } from 'react';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AgeRatingSliderProps {
  minValue?: number;
  maxValue?: number;
  step?: number;
  value: MaxAgeRatingFilter;
  onChangeSlider: (newValue: MaxAgeRatingFilter) => void;
  disabled?: boolean;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

const CONTENT_RESTRICTION_LEVELS = [
  {
    name: 'G',
    icon: Shield,
    colorClasses: {
      bg: 'bg-gray-500 text-black',
      text: 'text-gray-600',
      icon: 'text-gray-500',
    },
    description:
      'Very safe, no concerning content. Significantly limits the amount of content available.',
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    name: 'PG',
    icon: CheckCircle2,
    colorClasses: {
      bg: 'bg-green-500 text-black',
      text: 'text-green-600',
      icon: 'text-green-500',
    },
    description: 'Some elements present, but light and age-appropriate.',
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    name: 'PG-13',
    icon: AlertCircle,
    colorClasses: {
      bg: 'bg-yellow-400 text-black',
      text: 'text-yellow-600',
      icon: 'text-yellow-500',
    },
    description: 'More noticeable but still fairly limited.',
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    name: 'PG-13+',
    icon: AlertCircle,
    colorClasses: {
      bg: 'bg-orange-500 text-black',
      text: 'text-orange-600',
      icon: 'text-primary',
    },
    description: 'Most permissive but still within reason for ages 10-12.',
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
];

export function AgeRatingSlider({
  minValue = 0,
  maxValue = filterOptions.ageRating.length - 1,
  step = 1,
  value,
  onChangeSlider,
  disabled = false,
  label = 'Rating',
  orientation = 'horizontal',
}: AgeRatingSliderProps) {
  const [selectedRating, setSelectedRating] =
    useState<MaxAgeRatingFilter>(value);

  useEffect(() => {
    setSelectedRating(value);
  }, [value]);

  const sliderIndex = filterOptions.ageRating.indexOf(selectedRating);

  // Find the current restriction level based on the selected rating
  const getCurrentLevel = () => {
    const ratingName = selectedRating as string;
    return (
      CONTENT_RESTRICTION_LEVELS.find(level => level.name === ratingName) ||
      CONTENT_RESTRICTION_LEVELS[0]
    );
  };

  const currentLevel = getCurrentLevel();
  const LevelIcon = currentLevel.icon;

  // Calculate the tooltip position based on slider index
  const tooltipPosition = (sliderIndex / maxValue) * 100;

  const handleSliderChange = (values: number[]) => {
    const newIndex = values[0];
    const newRating = filterOptions.ageRating[newIndex] as MaxAgeRatingFilter;
    setSelectedRating(newRating);
    onChangeSlider(newRating);
  };

  return (
    <div className="flex flex-col relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <div
                className="absolute top-3 z-10"
                style={{
                  left: `${tooltipPosition}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div
                  className={`${currentLevel.colorClasses.bg} rounded py-1 px-3 text-xs font-medium relative whitespace-nowrap`}
                >
                  {currentLevel.name}
                  <div
                    className={`absolute -top-1 left-1/2 w-2 h-2 ${
                      currentLevel.colorClasses.bg.split(' ')[0]
                    } transform -translate-x-1/2 -rotate-45`}
                  ></div>
                </div>
              </div>
              <Slider
                orientation={orientation}
                value={[sliderIndex]}
                min={minValue}
                max={maxValue}
                step={step}
                onValueChange={handleSliderChange}
                disabled={disabled}
                aria-label={`${label} slider`}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            sideOffset={15}
            className="w-64 p-0 overflow-hidden z-50"
          >
            <div
              className={`${currentLevel.colorClasses.bg} p-2 flex items-center gap-2 rounded-t-sm`}
            >
              <LevelIcon className="h-5 w-5" />
              <span className="font-medium">{currentLevel.name}</span>
            </div>
            <div className="p-3 bg-white">
              <p className="text-sm text-gray-500">
                {currentLevel.description}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default AgeRatingSlider;
