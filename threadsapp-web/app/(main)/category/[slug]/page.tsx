import type { Metadata } from "next";
import { ListingPageView } from "@/components/listing/ListingPageView";
import { APP_URL } from "@/lib/constants";
import type { ProductFilters } from "@/types/filter.types";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = params.slug.replaceAll("-", " ");
  return {
    title: `Buy ${title} Online | ThreadsApp`,
    robots: { index: true, follow: true },
    alternates: { canonical: `${APP_URL}/category/${params.slug}` }
  };
}

export default function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> }) {
  return <ListingPageView title={params.slug.replaceAll("-", " ")} endpoint={`/categories/${params.slug}/products`} basePath={`/category/${params.slug}`} initialFilters={{ category: params.slug, sort: (searchParams.sort as string) as ProductFilters["sort"] }} />;
}
