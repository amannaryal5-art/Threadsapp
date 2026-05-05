import Image from "next/image";
import Link from "next/link";

const categories = [
  "Men",
  "Women",
  "Kids",
  "Ethnic",
  "Western",
  "Sports",
  "Accessories",
  "Sale"
];

export function CategoryGrid() {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/search?q=${category.toLowerCase()}`}
          className="group rounded-[28px] bg-white p-4 text-center shadow-soft transition hover:-translate-y-1"
        >
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={`https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80&${category}`}
              alt={category}
              fill
              className="object-cover transition duration-300 group-hover:scale-110"
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-secondary">{category}</p>
        </Link>
      ))}
    </section>
  );
}
