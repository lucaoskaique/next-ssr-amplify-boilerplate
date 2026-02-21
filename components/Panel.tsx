import { ReactNode } from 'react';

export default function Panel({
  children,
  className,
  header,
  sticky,
}: {
  children?: ReactNode;
  className?: string;
  header?: ReactNode;
  sticky?: boolean;
}) {
  return (
    <div
      className={`w-full bg-panel rounded-xl h-full flex flex-col ${className || ''}`}
    >
      {header && (
        <div className={`${sticky ? 'sticky top-0 z-10' : ''} flex-none`}>
          <div className="w-full flex flex-row justify-between bg-dashboard-panelHeader">
            <div className="w-6 h-6 bg-dashboard-background">
              <div className="bg-dashboard-panelHeader w-6 h-6 rounded-tl-xl" />
            </div>
            <div className="w-6 h-6 bg-dashboard-background">
              <div className="bg-dashboard-panelHeader w-6 h-6 rounded-tr-xl" />
            </div>
          </div>
          <div className="bg-panelHeader rounded-t-xl p-6 pt-0">{header}</div>
        </div>
      )}
      <div
        className="flex-1 min-h-0 overflow-auto"
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(203 213 225) transparent',
          msOverflowStyle: 'auto',
        }}
      >
        <div className={`px-6 ${header ? '' : 'pt-6'} pb-6`}>{children}</div>
      </div>
    </div>
  );
}
