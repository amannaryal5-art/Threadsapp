import type { Metadata } from "next";
import { ListingPageView } from "@/components/listing/ListingPageView";
import { APP_URL } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = params.slug.replaceAll("-", " ");
  return {
    title: `${title} | ThreadsApp`,
    robots: { index: true, follow: true },
    alternates: { canonical: `${APP_URL}/brand/${params.slug}` }
  };
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  return <ListingPageView title={params.slug.replaceAll("-", " ")} endpoint={`/brands/${params.slug}/products`} basePath={`/brand/${params.slug}`} initialFilters={{ brand: params.slug, sort: "popular" }} />;
}
