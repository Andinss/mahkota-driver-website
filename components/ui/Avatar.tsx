'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  name: string;
  photoUrl: string | null;
  size?: number;
}

export default function Avatar({ name, photoUrl, size = 48 }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const showImage = photoUrl && !imgError;

  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-gold text-brand-black font-semibold overflow-hidden"
      style={{ width: size, height: size }}
      aria-label={`Avatar ${name}`}
    >
      {showImage ? (
        <Image
          src={photoUrl}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="select-none"
          style={{ fontSize: size * 0.375 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
