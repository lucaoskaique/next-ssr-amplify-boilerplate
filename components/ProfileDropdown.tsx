'use client';

import { logOut } from '@/lib/action';
import type { Profile } from '@/types/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, LogOut, Shield, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useProfiles } from '@/hooks/useProfiles';

function getAvatarLink(avatar: string | undefined) {
  return `/avatars/${avatar}.jpg`;
}

export function ProfileDropdown({
  userProfileId,
  profiles,
  selectedProfile,
  disabled,
}: {
  userProfileId?: string;
  profiles: Profile[];
  selectedProfile: string;
  disabled?: boolean;
  profileRedirectUrl?: string;
}) {
  const router = useRouter();
  const { activeProfile, childProfiles, switchProfile } = useProfiles(
    profiles,
    selectedProfile,
    userProfileId,
  );

  async function onLogout() {
    await logOut();
  }

  const handleRatingsClick = () => {
    router.push(`/${selectedProfile}/settings/ratings/customize`);
  };

  const handleKnowledgeCenterClick = () => {
    // TODO: Update with your knowledge center URL
    window.open('https://example.com/help', '_blank');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            variant="ghost"
            className="p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <div className="flex flex-row-reverse md:flex-row items-center gap-3">
              <Image
                src="/arrow-down.svg"
                alt="Down arrow"
                width={20}
                height={20}
                className="opacity-70"
              />
              <div>
                <div className="text-2xl font-semibold text-primary-400">
                  {activeProfile?.name}
                </div>
              </div>
              <div className="shrink-0">
                <Image
                  src={getAvatarLink(activeProfile?.avatar)}
                  alt="avatar"
                  className="rounded-full w-8 h-8 md:w-12 md:h-12 object-cover"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-2">
          {/* Switch Profile section */}
          <DropdownMenuLabel className="text-md font-medium text-primary-400">
            Switch Profile
          </DropdownMenuLabel>
          {childProfiles.length > 0 ? (
            childProfiles.map(profile => (
              <DropdownMenuItem
                key={profile.id}
                onSelect={() => switchProfile(profile.id)}
                className="text-lg py-2 text-primary-400 focus:bg-primary-50"
              >
                <Image
                  src={getAvatarLink(profile.avatar) || '/placeholder.svg'}
                  alt={`${profile.name}'s avatar`}
                  className="rounded-full mr-3 w-8 h-8 object-cover"
                  width={32}
                  height={32}
                />
                <span className="font-medium">{profile.name}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem
              className="text-base py-2 text-gray-500 focus:bg-transparent cursor-default"
              disabled
            >
              <span className="font-medium">No profiles available</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-2" />

          {/* Profile Settings submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-lg py-2 text-primary-400 focus:bg-primary-50">
              <Settings className="mr-3 h-5 w-5" />
              <span className="font-medium">Profile Settings</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56 p-2">
              <DropdownMenuItem
                className="text-lg py-1 text-primary-400 focus:bg-primary-50"
                onSelect={handleRatingsClick}
              >
                <Shield className="mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Ratings</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Knowledge Center */}
          <DropdownMenuItem
            className="text-lg py-2 text-purple-600 hover:text-purple-700 focus:bg-purple-50"
            onSelect={handleKnowledgeCenterClick}
          >
            <BookOpen className="mr-3 h-5 w-5" />
            <span className="font-medium">Knowledge Center</span>
          </DropdownMenuItem>

          {/* Logout */}
          <DropdownMenuItem
            onSelect={onLogout}
            className="text-lg py-2 text-red-600 focus:bg-red-600 focus:text-white data-[highlighted]:bg-red-600 data-[highlighted]:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
