'use client';

import React from 'react';
import Panel from './Panel';
import { logOut } from '@/lib/action';
import Image from 'next/image';

export const NoProfileMessage = () => {
  return (
    <div className="flex p-4">
      <Panel className="p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              No Profile Found
            </h1>

            <p className="text-gray-600">
              You don&apos;t have a profile yet. Please create one in the app.
            </p>
          </div>

          <button
            onClick={() => {
              logOut();
            }}
            className="flex items-center justify-center gap-2 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors mt-4"
          >
            <Image src="/logout.svg" alt="logout" width={24} height={24} />
            <span>Logout</span>
          </button>
        </div>
      </Panel>
    </div>
  );
};

export default NoProfileMessage;
