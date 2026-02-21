'use client';

import type { Profile } from '@/types/client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ProfileMenu } from './ProfileMenu';

export default function Header({
  profiles,
  selectedProfile,
  userProfile,
  disableProfileSwitch,
  left,
}: {
  profiles: Profile[];
  selectedProfile?: string;
  userProfile?: string;
  disableProfileSwitch?: boolean;
  left?: ReactNode;
}) {
  console.log(
    '[Client Component] Header - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  return (
    <header className="p-4 pt-6 md:pt-8">
      <div
        className={`flex ${left ? 'flex-row' : 'flex-row'} items-center justify-between`}
      >
        {/* Logo section */}
        {left ?? (
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link href={`/`} className="flex items-center gap-2 text-sm">
              <div className="text-2xl font-bold">App Name</div>
            </Link>
          </div>
        )}

        {/* Profile/User Menu */}
        <div className="flex items-center">
          {selectedProfile ? (
            <ProfileMenu
              profiles={profiles}
              selectedProfile={selectedProfile}
              userProfileId={userProfile}
              disabled={disableProfileSwitch}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
