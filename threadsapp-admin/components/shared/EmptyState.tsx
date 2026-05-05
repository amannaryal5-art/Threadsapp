import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, description, ctaLabel, ctaHref }: { title: string; description: string; ctaLabel?: string; ctaHref?: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <PackageSearch className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-slate-500">{description}</p>
        {ctaLabel && ctaHref ? (
          <Button asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
