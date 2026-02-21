'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  const modal = (
    <div
      className="fixed bg-modal top-0 left-0 w-screen h-screen flex items-center justify-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 pt-2 shadow-xl rounded-xl flex flex-col gap-2 min-w-96"
        onClick={ev => ev.stopPropagation()}
      >
        <div>
          <button
            onClick={onClose}
            className="flex flex-row items-center gap-2"
          >
            <Image src="/close.svg" alt="Back" width={24} height={24} />
            CLOSE
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.getElementById('portal')!);
}
