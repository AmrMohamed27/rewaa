"use client";

import Image, { ImageLoaderProps } from "next/image";
import type { Media } from "@/payload-types";

interface Props {
  media: Media | string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export default function PayloadImage({ media, className, fill, priority, sizes }: Props) {
  // Fallback if media is not populated or is just a string URL
  if (typeof media === "string") {
    return <Image src={media} alt="Image" fill={fill} className={className} />;
  }

  // Ensure we have a valid media object
  if (!media?.url) return null;

  // THE MAGIC LOADER: Map Next.js width requests to Payload sizes
  const payloadLoader = ({ width }: ImageLoaderProps): string => {
    const mediaSizes = media.sizes;
    const originalUrl = media.url as string;

    if (!mediaSizes) return originalUrl;

    // Match Next.js requested width to your specific Payload sizes
    if (width <= 400 && mediaSizes.thumbnail?.url) return mediaSizes.thumbnail.url;
    if (width <= 768 && mediaSizes.card?.url) return mediaSizes.card.url;
    if (width <= 1024 && mediaSizes.tablet?.url) return mediaSizes.tablet.url;

    // Fallback to original for huge screens
    return originalUrl;
  };

  return (
    <Image
      loader={payloadLoader}
      src={media.url}
      alt={media.alt || "Media image"}
      fill={fill}
      // If not using 'fill', provide width/height to prevent Layout Shift
      width={!fill ? media.width || 800 : undefined}
      height={!fill ? media.height || 600 : undefined}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      priority={priority}
      className={className}
    />
  );
}
