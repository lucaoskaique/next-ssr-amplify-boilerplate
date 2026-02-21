import { Profile } from '@/types/client';
import { useRouter } from 'next/navigation';

interface UseProfilesReturn {
  activeProfile: Profile | undefined;
  childProfiles: Profile[];
  isUserProfile: boolean;
  switchProfile: (profileId: string) => void;
}

export function useProfiles(
  profiles: Profile[],
  selectedProfile: string,
  userProfileId?: string,
): UseProfilesReturn {
  const router = useRouter();
  const selected = profiles.find(p => p.id === selectedProfile);
  const childProfiles = profiles.filter(
    p => p.id !== userProfileId && p.id !== selectedProfile,
  );

  const handleProfileSwitch = (profileId: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${selectedProfile}`, `/${profileId}`);
    router.push(newPath);
  };

  return {
    activeProfile: selected,
    childProfiles,
    isUserProfile: selected?.id === userProfileId,
    switchProfile: handleProfileSwitch,
  };
}
