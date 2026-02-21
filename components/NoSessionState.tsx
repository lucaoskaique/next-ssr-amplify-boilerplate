'use client';

import React from 'react';
import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';

const NoSessionState = () => {
  return (
    <main className="min-h-screen w-full bg-gray-50 p-4">
      <div className="h-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 bg-blue-50 p-3 rounded-full inline-flex">
              <LockKeyhole className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Session Required
            </h2>
            <p className="text-gray-500 mb-6">
              Please sign in to access this page. If you were previously signed
              in, your session may have expired.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="inline-block px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoSessionState;
