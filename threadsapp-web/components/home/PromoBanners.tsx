import Link from "next/link";

const promos = [
  { title: "Ethnic Wear", href: "/search?q=ethnic", gradient: "from-amber-500 to-orange-400" },
  { title: "Workwear Edit", href: "/search?q=workwear", gradient: "from-slate-800 to-slate-600" },
  { title: "Street Style", href: "/search?q=streetwear", gradient: "from-teal-500 to-cyan-500" }
];

export function PromoBanners() {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {promos.map((promo) => (
        <Link
          key={promo.title}
          href={promo.href}
          className={`rounded-[32px] bg-gradient-to-br ${promo.gradient} p-8 text-white shadow-soft`}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Editorial Drop</p>
          <h3 className="mt-3 text-3xl font-semibold">{promo.title}</h3>
          <span className="mt-8 inline-block text-sm font-semibold">Shop Now</span>
        </Link>
      ))}
    </section>
  );
}
