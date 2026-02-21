import { useEffect, useRef } from 'react';
import ContentRatingSettings from './ContentRatingSettings';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDropdown({ isOpen, onClose }: SettingsDropdownProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-800"
          role="dialog"
          aria-modal="true"
        >
          <div className="sticky top-0 flex justify-between items-center p-6 bg-white border-b z-20">
            <h1 className="text-dashboard-primary text-2xl font-bold">
              Settings
            </h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="relative">
            <ContentRatingSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
