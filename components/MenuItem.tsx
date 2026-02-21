import { ReactNode } from 'react';

export type MenuItemProps = {
  disabled?: boolean;
  Icon?: React.ComponentType<{ className?: string }>;
  IconRight?: React.ComponentType<{ className?: string }>;
  iconEnabledClass?: string;
  children?: ReactNode;
  onIconClick?: () => void;
  onIconRightClick?: () => void;
  onClick?: (() => void) | (() => boolean);
};

export default function MenuItem({
  Icon,
  IconRight,
  iconEnabledClass,
  children,
  disabled,
  onClick,
  onIconClick,
  onIconRightClick,
}: MenuItemProps) {
  return (
    <div
      className={`
        px-6
        text-nowrap
        w-full
        text-left
        flex
        flex-row
        gap-3
        items-center
        ${Icon && IconRight ? 'justify-between' : ''}
        ${disabled ? 'text-text-disabled cursor-default' : 'hover:bg-darken-100'}
        select-none
      `}
      role="button"
      onClick={disabled ? undefined : onClick}
    >
      {Icon && (
        <button
          className="flex flex-shrink-0 items-center justify-center h-7 w-7"
          onClick={e => {
            if (onIconClick) {
              e.stopPropagation();
              onIconClick();
            }
          }}
        >
          <Icon
            className={disabled ? 'fill-text-disabled' : iconEnabledClass}
          />
        </button>
      )}
      <div className="py-3">{children}</div>
      {IconRight && (
        <button
          className="flex flex-shrink-0 items-center justify-center h-7 w-7"
          onClick={e => {
            if (onIconRightClick) {
              e.stopPropagation();
              onIconRightClick();
            }
          }}
        >
          <IconRight
            className={disabled ? 'fill-text-disabled' : iconEnabledClass}
          />
        </button>
      )}
    </div>
  );
}
