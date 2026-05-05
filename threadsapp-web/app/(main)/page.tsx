"use client";

import { motion } from "framer-motion";
import { BrandStrip } from "@/components/home/BrandStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashSaleBanner } from "@/components/home/FlashSaleBanner";
import { HeroBanner } from "@/components/home/HeroBanner";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ProductSection } from "@/components/home/ProductSection";
import { PromoBanners } from "@/components/home/PromoBanners";
import { SkeletonGrid } from "@/components/shared/SkeletonGrid";
import { useHomeProducts } from "@/hooks/useProducts";

export default function HomePage() {
  const { deals, newArrivals, trending, featured } = useHomeProducts();
  const sectionClass = "space-y-20 py-8";

  return (
    <main className="container py-8">
      <div className={sectionClass}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <HeroBanner />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
          <CategoryGrid />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
          {deals.isLoading ? <SkeletonGrid count={4} /> : <FlashSaleBanner products={deals.data ?? []} />}
        </motion.div>
        <BrandStrip />
        {newArrivals.isLoading ? <SkeletonGrid count={4} /> : <ProductSection title="New Arrivals" products={newArrivals.data ?? []} href="/search?sort=newest" />}
        <PromoBanners />
        {trending.isLoading ? <SkeletonGrid count={4} /> : <ProductSection title="Trending Now 🔥" products={trending.data ?? []} href="/search?sort=popular" />}
        {deals.isLoading ? <SkeletonGrid count={4} /> : <ProductSection title="Under ₹999" products={(deals.data ?? []).filter((item) => Number(item.sellingPrice) <= 999)} href="/search?maxPrice=999" />}
        {featured.isLoading ? <SkeletonGrid count={4} /> : <ProductSection title="Top Rated ⭐" products={featured.data ?? []} href="/search?sort=rating" />}
        <NewsletterSection />
      </div>
    </main>
  );
}
