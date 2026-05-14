"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImagePreview({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = !hasError ? src : null;
  return (
    <div className={cn("relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100", className)}>
      {resolvedSrc ? (
        <Image src={resolvedSrc} alt={alt} fill sizes="56px" className="object-cover" onError={() => setHasError(true)} />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
      )}
    </div>
  );
}
