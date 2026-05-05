"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { AppButton } from "@/components/shared/AppButton";

export function ShareButton({
  title,
  text,
  url
}: {
  title: string;
  text: string;
  url: string;
}) {
  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      toast.error("Could not share this product");
    }
  };

  return (
    <AppButton variant="outline" onClick={onShare}>
      <Share2 className="h-4 w-4" />
      Share
    </AppButton>
  );
}
