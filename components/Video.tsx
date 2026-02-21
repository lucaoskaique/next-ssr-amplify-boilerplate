'use client';

import {
  VideoDetails,
  VideoSearchResult,
  YouTubeContent,
} from '@/types/client';
import Image from 'next/image';
import { useState, useCallback, MouseEvent, useMemo } from 'react';
import Modal from './Modal';
import YouTube from 'react-youtube';
import Thumb from './icons/Thumb';
import Activity from './Activity';

export default function Video({
  profileId,
  video,
  title,
  watched,
  canVote,
  vote,
  onVote,
}: {
  profileId: string;
  video: VideoSearchResult | YouTubeContent;
  title?: string;
  watched?: boolean;
  canVote?: boolean;
  vote?: 'good' | 'bad';
  onVote?: (vote: 'good' | 'bad' | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [channel, _setChannel] = useState<string>('');
  const [channelBlocked, setChannelBlocked] = useState<boolean>();
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const width = open ? Math.min(800, document.body.offsetWidth * 0.75) : 800;
  const height = Math.floor(width * 0.66);
  const channelId = '';

  const handleVideoClick = useCallback(() => {
    const hasVideoLink = (
      v: any,
    ): v is VideoDetails & { video_link: string } => {
      return (
        'video_link' in v && v.video_link !== null && v.video_link !== undefined
      );
    };

    if (
      'service' in video &&
      (video.service === 'disney' || video.service === 'netflix') &&
      hasVideoLink(video)
    ) {
      window.open(video.video_link, '_blank', 'noopener,noreferrer');
    } else {
      setOpen(true);
    }
  }, [video]);

  const handleVote = async (
    e: MouseEvent<HTMLDivElement>,
    vote: 'good' | 'bad' | null,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onVote?.(vote);
  };

  const ytOpts = useMemo(
    () => ({
      width,
      height,
      playerVars: {
        autoplay: true,
      },
    }),
    [height, width],
  );

  const ytReady = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="relative">
            <div
              className={`flex flex-col items-center ${ready ? '' : 'invisible'}`}
            >
              <YouTube videoId={video.id} opts={ytOpts} onReady={ytReady} />
            </div>

            <div
              className={`
                absolute
                opacity-40
                h-24
                w-24
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                ${ready ? 'hidden' : 'flex'}
              `}
            >
              <Activity />
            </div>
          </div>

          <div className="flex flex-row gap-4">
            {channel && channelId && profileId && (
              <label className="flex flex-row gap-2 items-center">
                <input
                  type="checkbox"
                  disabled={busy}
                  checked={channelBlocked}
                  onChange={async () => {
                    // Toggle the channel block
                    setBusy(true);
                    try {
                      if (!channelBlocked) {
                        await fetch(`/api/blocked-channels/${profileId}`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ channelId }),
                        });
                        setChannelBlocked(true);
                      } else {
                        await fetch(
                          `/api/blocked-channels/${profileId}/${channelId}`,
                          {
                            method: 'DELETE',
                          },
                        );
                        setChannelBlocked(false);
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
                Block all videos from {channel}
              </label>
            )}
          </div>
        </Modal>
      )}
      <button
        className="w-full aspect-video bg-center rounded-xl bg-cover relative"
        style={{
          backgroundImage: `url(${('image' in video && video.image) || ('thumbnail' in video && video.thumbnail) || ''})`, //this ugly thing we need to change later because this component is used for a parent one that used dialogs and dialogs uses youtubecontent
        }}
        onClick={handleVideoClick}
      >
        {watched ? (
          <div
            className={`absolute right-2 ${canVote ? 'top-2' : 'bottom-2'} bg-[#FACC15] text-xs py-1 px-2 rounded-full text-dashboard-primary pointer-events-none`}
          >
            Watched
          </div>
        ) : null}
        {canVote ? (
          <div className="absolute right-2 bottom-2 bg-blur text-xs rounded-lg text-dashboard-primary overflow-hidden flex flex-row">
            <div
              role="button"
              className={`p-3 ${vote === 'good' ? 'bg-message-success-icon' : ''}`}
              onClick={e => handleVote(e, vote === 'good' ? null : 'good')}
            >
              <Thumb
                className={
                  vote === 'good' ? 'fill-white' : 'fill-dashboard-secondary'
                }
              />
            </div>
            <div
              role="button"
              className={`p-3 ${vote === 'bad' ? 'bg-message-error-icon' : ''}`}
              onClick={e => handleVote(e, vote === 'bad' ? null : 'bad')}
            >
              <Thumb
                down
                className={
                  vote === 'bad' ? 'fill-white' : 'fill-dashboard-secondary'
                }
              />
            </div>
          </div>
        ) : null}
      </button>
      {title && (
        <div className="flex flex-row items-start gap-1">
          <div className="flex-shrink-0">
            <Image
              src="/question.svg"
              alt="question"
              width={18}
              height={18}
              className="mt-1"
            />
          </div>
          <span className="truncate max-w-full">{title}</span>
        </div>
      )}
    </div>
  );
}
