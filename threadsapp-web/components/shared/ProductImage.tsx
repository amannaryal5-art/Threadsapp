"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCT_IMAGE_FALLBACK } from "@/lib/product-media";

export function ProductImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = !hasError && src ? src : PRODUCT_IMAGE_FALLBACK;

  return (
    <>
      {!hasLoaded ? <div className="absolute inset-0 animate-pulse bg-slate-100" /> : null}
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onLoad={() => setHasLoaded(true)}
        onError={() => {
          setHasError(true);
          setHasLoaded(true);
        }}
      />
    </>
  );
}
