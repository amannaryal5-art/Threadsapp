"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AppButton } from "@/components/shared/AppButton";

const slides = [
  {
    title: "New Summer Collection",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80",
    href: "/search?q=summer%20collection"
  },
  {
    title: "Men's Formals — Up to 50% Off",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    href: "/search?q=mens%20formals"
  },
  {
    title: "Kids Wear — Cute & Comfy",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1400&q=80",
    href: "/search?q=kids%20wear"
  }
];

export function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    const timer = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="overflow-hidden rounded-[36px] bg-secondary text-white">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.title} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative h-[420px]">
                <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-75" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/50 to-transparent" />
                <motion.div
                  className="absolute left-8 top-1/2 max-w-lg -translate-y-1/2 md:left-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-4xl font-bold md:text-5xl">{slide.title}</h1>
                  <p className="mt-4 text-white/75">Fresh silhouettes, elevated fabrics, and standout daily style.</p>
                  <Link href={slide.href}>
                    <AppButton className="mt-8">Shop Now</AppButton>
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 md:block">
        <button onClick={() => emblaApi?.scrollPrev()} className="rounded-full bg-white/10 p-3 backdrop-blur">
          <ChevronLeft />
        </button>
      </div>
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block">
        <button onClick={() => emblaApi?.scrollNext()} className="rounded-full bg-white/10 p-3 backdrop-blur">
          <ChevronRight />
        </button>
      </div>
      <div className="flex justify-center gap-2 pb-5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition ${selected === index ? "w-8 bg-primary" : "w-2 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
