import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  className,
  size = 14
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={index < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-secondary/20"}
        />
      ))}
    </div>
  );
}
