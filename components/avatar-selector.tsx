'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, User } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  disabled?: boolean;
}

const PREDEFINED_AVATARS = [
  { name: 'kitten', url: '/avatars/kitten.jpg', label: 'Kitten' },
  { name: 'puppy', url: '/avatars/puppy.jpg', label: 'Puppy' },
  { name: 'duck', url: '/avatars/duck.jpg', label: 'Duck' },
  { name: 'unicorn', url: '/avatars/unicorn.jpg', label: 'Unicorn' },
  { name: 'rocket', url: '/avatars/rocket.jpg', label: 'Rocket' },
  { name: 'car', url: '/avatars/car.jpg', label: 'Car' },
  { name: 'soccer', url: '/avatars/soccer.jpg', label: 'Soccer' },
  { name: 'helmet', url: '/avatars/helmet.jpg', label: 'Helmet' },
];

export function AvatarSelector({
  currentAvatar,
  onAvatarChange,
  disabled = false,
}: AvatarSelectorProps) {
  const [showPredefined, setShowPredefined] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for uploaded file
      const reader = new FileReader();
      reader.onload = event => {
        onAvatarChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentAvatarUrl = () => {
    if (!currentAvatar) return '';

    // If it's a predefined avatar name, convert to URL
    const predefined = PREDEFINED_AVATARS.find(a => a.name === currentAvatar);
    if (predefined) {
      return predefined.url;
    }

    // Otherwise use as is (uploaded file or full URL)
    return currentAvatar;
  };

  return (
    <div className="space-y-4">
      {/* Current Avatar Display */}
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-20 w-20">
          <AvatarImage src={getCurrentAvatarUrl()} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Toggle between predefined and upload */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={showPredefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowPredefined(true)}
          disabled={disabled}
        >
          Choose Avatar
        </Button>
        <Button
          type="button"
          variant={!showPredefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowPredefined(false)}
          disabled={disabled}
        >
          Upload Custom
        </Button>
      </div>

      {showPredefined ? (
        /* Predefined Avatars Grid */
        <div className="grid grid-cols-4 gap-2">
          {PREDEFINED_AVATARS.map(avatar => (
            <button
              key={avatar.name}
              type="button"
              onClick={() => onAvatarChange(avatar.name)}
              disabled={disabled}
              className={`p-1 rounded-lg border-2 transition-colors ${
                currentAvatar === avatar.name
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatar.url} alt={avatar.label} />
                <AvatarFallback>{avatar.label[0]}</AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
      ) : (
        /* File Upload */
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Custom Avatar
          </Button>
        </div>
      )}
    </div>
  );
}
