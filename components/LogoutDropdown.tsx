'use client';

import { useEffect, useRef, useState } from 'react';
import { logOut } from '@/lib/action';
import Image from 'next/image';

export default function LogoutDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClick = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        aria-expanded={isOpen}
      >
        <span className="text-lg">Menu</span>
        <Image src="/arrow-down.svg" alt="Toggle menu" width={20} height={20} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50"
        >
          <button
            onClick={logOut}
            className="flex items-center gap-2 w-full p-3 hover:bg-gray-50 text-left"
          >
            <Image src="/logout.svg" alt="logout" width={24} height={24} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
