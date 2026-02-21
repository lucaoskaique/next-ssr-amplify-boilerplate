'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/utils/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  // create a ref to track drag state
  const isDraggingRef = React.useRef(false);

  // handle pointer down event
  const handlePointerDown = React.useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  // handle pointer up event
  const handlePointerUp = React.useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // add cleanup function to handle component unmounting during drag
  React.useEffect(() => {
    return () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
      }
    };
  }, []);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center data-[orientation=vertical]:flex-col',
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20 data-[orientation=vertical]:w-1.5 data-[orientation=vertical]:h-full">
        <SliderPrimitive.Range className="absolute h-full bg-primary data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
