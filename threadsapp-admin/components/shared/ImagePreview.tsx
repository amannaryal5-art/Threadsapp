import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImagePreview({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  return (
    <div className={cn("relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100", className)}>
      {src ? <Image src={src} alt={alt} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>}
    </div>
  );
}
