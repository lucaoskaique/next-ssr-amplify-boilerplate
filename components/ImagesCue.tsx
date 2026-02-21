'use client';

import { VisualAid, isImagesCue } from '@/types/client';
import { useState } from 'react';

export default function ImagesCue({
  aid,
  className,
  linked,
}: {
  aid: VisualAid;
  className?: string;
  linked?: boolean;
}) {
  const [index, setIndex] = useState(0);

  if (!isImagesCue(aid.cue)) {
    return null;
  }

  const imageContent = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={aid.cue.Images[index].url}
      alt={aid.cue.Images[index].ariaLabel}
      className={`object-cover ${className}`}
      onError={() => {
        setIndex(prev => prev + 1);
      }}
    />
  );

  if (linked) {
    return (
      <a
        href={aid.cue.Images[index].url}
        title={aid.cue.Images[index].title}
        target="_blank"
      >
        {imageContent}
      </a>
    );
  } else {
    return imageContent;
  }
}
