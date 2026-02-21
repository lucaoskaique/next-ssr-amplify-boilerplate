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
import { useMediaQuery } from '@/hooks/useMediaQuery';

function getAvatarLink(avatar: string | undefined) {
  return `/avatars/${avatar}.jpg`;
}

export function ProfileMenu({
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

  // check if we are on a mobile device
  const isMobile = useMediaQuery('(max-width: 768px)');

  async function onLogout() {
    await logOut();
  }

  const handleSettingsClick = () => {
    router.push(`/${selectedProfile}/settings`);
  };

  const handleHelpClick = () => {
    // TODO: Update with your help/documentation URL
    window.open('https://example.com/help', '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="ghost"
          className="p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <Image
                src={getAvatarLink(activeProfile?.avatar) || '/placeholder.svg'}
                alt="avatar"
                className="rounded-full w-8 h-8 md:w-12 md:h-12 object-cover"
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="text-lg md:text-2xl font-semibold text-primary-400 truncate max-w-[100px] md:max-w-[160px]">
                {activeProfile?.name}
              </div>
            </div>
            <Image
              src="/arrow-down.svg"
              alt="Down arrow"
              width={16}
              height={16}
              className="opacity-70"
            />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[250px] p-2"
        align="end"
        sideOffset={isMobile ? 5 : 10}
      >
        {/* Switch Profile section */}
        <DropdownMenuLabel className="text-sm md:text-md font-medium text-primary-400">
          Switch Profile
        </DropdownMenuLabel>
        <div className="flex flex-col gap-1">
          {childProfiles.map(profile => (
            <DropdownMenuItem
              key={profile.id}
              onClick={() => switchProfile(profile.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <Image
                  src={getAvatarLink(profile.avatar)}
                  alt={profile.name}
                  className="rounded-full w-8 h-8 object-cover"
                  width={32}
                  height={32}
                />
                <span className="text-sm truncate">{profile.name}</span>
                {profile.id === selectedProfile && (
                  <span className="ml-auto text-primary-400">✓</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuItem
          onClick={handleSettingsClick}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {/* Help/Documentation */}
        <DropdownMenuItem onClick={handleHelpClick} className="cursor-pointer">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Help Center</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
