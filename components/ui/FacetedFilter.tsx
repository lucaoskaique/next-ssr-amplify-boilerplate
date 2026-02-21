'use client';

import type * as React from 'react';
import { Check, PlusCircle, Info } from 'lucide-react';

import { cn } from '@/utils/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FacetedFilterProps {
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
    tooltip?: string;
  }[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function FacetedFilter({
  title,
  options,
  value,
  onChange,
}: FacetedFilterProps) {
  const selectedValues = new Set(value);

  return (
    <TooltipProvider>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 border-dashed">
            <PlusCircle className="h-4 w-4" />
            {title}
            {selectedValues.size > 0 && (
              <>
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {options
                    .filter(option => selectedValues.has(option.value))
                    .map(option => option.label)
                    .join(', ')}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map(option => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <div
                      key={`${option.label}-${option.value}`}
                      className="flex"
                    >
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          if (option.disabled) return;
                          if (isSelected) {
                            selectedValues.delete(option.value);
                          } else {
                            selectedValues.add(option.value);
                          }
                          const newValues = Array.from(selectedValues);
                          onChange(newValues);
                        }}
                        disabled={option.disabled}
                        className={cn(
                          option.disabled && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <Check className={cn('h-4 w-4')} />
                        </div>
                        <div className="flex items-center gap-1 flex-1">
                          <span>{option.label}</span>
                        </div>
                      </CommandItem>
                      {option.tooltip && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="flex items-center"
                              onMouseEnter={e => e.stopPropagation()}
                              onClick={e => e.stopPropagation()}
                            >
                              <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            align="center"
                            className="z-50 bg-black text-white border-black max-w-xs"
                            sideOffset={5}
                            avoidCollisions={true}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {option.tooltip}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => onChange([])}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
