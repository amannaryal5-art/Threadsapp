import Image from "next/image";
import Link from "next/link";

const sections = [
  { title: "Topwear", items: ["T-Shirts", "Shirts", "Polos", "Sweatshirts"] },
  { title: "Bottomwear", items: ["Jeans", "Trousers", "Shorts", "Joggers"] },
  { title: "Ethnic", items: ["Kurtas", "Sherwanis", "Dhoti"] }
];

export function CategoryMegaMenu() {
  return (
    <div className="absolute left-1/2 top-full z-30 hidden w-[880px] -translate-x-1/2 rounded-[32px] border border-secondary/10 bg-white p-8 shadow-card group-hover:block">
      <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{section.title}</h4>
            <ul className="mt-4 space-y-3 text-sm text-secondary/70">
              {section.items.map((item) => (
                <li key={item}>
                  <Link href={`/search?q=${encodeURIComponent(item)}`} className="hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="overflow-hidden rounded-[28px] bg-secondary text-white">
          <div className="relative h-52">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
              alt="Trending menswear"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold">Trending</span>
            <p className="mt-3 text-lg font-semibold">Weekend fits that move from brunch to late-night plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
