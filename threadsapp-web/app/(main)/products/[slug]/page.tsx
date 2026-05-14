import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { APP_URL, SERVER_API_URL } from "@/lib/constants";
import { getProductThumbnail } from "@/lib/product-media";
import type { ApiResponse } from "@/types/api.types";
import type { Product, ProductReview } from "@/types/product.types";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const response = await fetch(`${SERVER_API_URL}/products/${slug}`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = (await response.json()) as ApiResponse<{ product: Product }>;
  return data.data.product;
}

async function getReviews(slug: string) {
  const response = await fetch(`${SERVER_API_URL}/products/${slug}/reviews`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as ApiResponse<{ reviews: ProductReview[] }>;
  return data.data.reviews;
}

async function getSimilar(slug: string) {
  const response = await fetch(`${SERVER_API_URL}/products/${slug}/similar`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as ApiResponse<{ products: Product[] }>;
  return data.data.products;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} - Buy ${product.name} Online | ThreadsApp`,
    description: (product.description ?? product.name).slice(0, 160),
    alternates: { canonical: `${APP_URL}/products/${product.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: product.name,
      description: (product.description ?? product.name).slice(0, 160),
      images: [getProductThumbnail(product) ?? `${APP_URL}/og-image.png`]
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, reviews, similar] = await Promise.all([getProduct(params.slug), getReviews(params.slug), getSimilar(params.slug)]);
  if (!product) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((image) => image.url) ?? [getProductThumbnail(product)],
    description: product.description,
    brand: { "@type": "Brand", name: product.Brand?.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: Number(product.sellingPrice),
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductDetailView product={product} reviews={reviews} similar={similar} />
    </>
  );
}
