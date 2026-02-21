'use client';

import {
  Children,
  ReactNode,
  cloneElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { MenuItemProps } from './MenuItem';

type PopOverProps = {
  children:
    | React.ReactElement<MenuItemProps>
    | React.ReactElement<MenuItemProps>[];
  trigger?: ReactNode;
  mobileTitle?: string;
  onClose?: () => void;
};

export type PopOverMenuRef = {
  close: () => void;
};

const PopOverMenu = forwardRef<PopOverMenuRef, PopOverProps>(
  ({ trigger, children, mobileTitle, onClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useImperativeHandle(ref, () => ({
      close: () => setIsOpen(false),
    }));

    useEffect(() => {
      if (isOpen) {
        const handleClick = (e: MouseEvent) => {
          if (
            popoverRef.current &&
            !popoverRef.current.contains(e.target as Node)
          ) {
            setIsOpen(false);
            onCloseRef.current?.();
          }
        };

        document.addEventListener('click', handleClick);

        return () => {
          document.removeEventListener('click', handleClick);
        };
      } else {
        onCloseRef.current?.();
      }
    }, [isOpen]);

    return (
      <div className="relative">
        <button onClick={() => setIsOpen(prev => !prev)}>{trigger}</button>
        <div
          ref={popoverRef}
          className={`fixed md:absolute w-screen md:w-full min-w-popover right-0 bottom-0 md:left-2 md:top-2 opacity-0 md:animate-none ${isOpen ? 'animate-slideUp md:opacity-100' : 'animate-slideDown pointer-events-none'}`}
        >
          <div className="bg-white w-full md:max-w-60 rounded-xl shadow-2xl md:shadow-xl overflow-hidden">
            {mobileTitle && (
              <div className="md:hidden text-lg font-semibold p-4 text-center border-b border-darken-200">
                {mobileTitle}
              </div>
            )}
            {Children.map(children, child => {
              return cloneElement(child, {
                onClick: () => {
                  if (child.props.onClick && child.props.onClick() !== false) {
                    setIsOpen(false);
                    onCloseRef.current?.();
                  }
                },
              });
            })}
          </div>
        </div>
      </div>
    );
  },
);

export default PopOverMenu;
