'use client';

import { VideoSearchResult } from '@/types/client';
import { useCallback, useEffect, useState } from 'react';
import Video from './Video';

export default function VideoList({
  videos,
  profileId,
}: {
  videos: VideoSearchResult[];
  profileId: string;
}) {
  const [data, setData] = useState<VideoSearchResult[]>(videos);
  const [offset, setOffset] = useState(videos.length + 1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    setData(videos);
    setOffset(videos.length + 1);
    setHasMore(true);
  }, [videos]);

  const loadMoreVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      const requestOffset = Math.max(offset, 1);
      params.set('offset', requestOffset.toString());
      params.set('limit', LIMIT.toString());

      const response = await fetch(`/api/videos/${profileId}/?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }

      const responseData = await response.json();
      const newVideos = responseData.videos || [];

      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setData(currentData => [...currentData, ...newVideos]);
        setOffset(requestOffset + LIMIT);
      }
    } catch (error) {
      console.error('Error fetching more videos:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, profileId]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>No videos found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((d, index) => (
          <div key={`${d.id}-${index}`}>
            <Video
              profileId={profileId}
              video={d}
              title={d.title || undefined}
            />
          </div>
        ))}
      </div>

      <div className="text-center text-gray-500 mt-4">
        Showing {data.length} videos
      </div>

      <div className="flex justify-center mt-8 mb-4">
        {hasMore && (
          <button
            onClick={loadMoreVideos}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Load More'
            )}
          </button>
        )}

        {!hasMore && data.length > 0 && (
          <div className="text-center text-gray-500 py-2">
            No more videos to load
          </div>
        )}
      </div>
    </div>
  );
}
