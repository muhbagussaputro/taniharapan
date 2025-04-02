"use client";

import Image from "next/image";
import { useState } from "react";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export default function CloudinaryImage({
  src,
  alt,
  width = 600,
  height = 600,
  fill = false,
  priority = false,
  className = "",
  sizes = "100vw",
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Tampilkan gambar secara langsung, tanpa transformasi
  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''} ${fill ? 'w-full h-full' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        sizes={sizes}
        quality={90}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
} 