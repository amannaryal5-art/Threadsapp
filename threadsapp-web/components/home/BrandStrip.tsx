const brands = ["Nike", "Levis", "Puma", "U.S. Polo", "Biba", "H&M", "Wrogn", "ONLY"];

export function BrandStrip() {
  const repeated = [...brands, ...brands];
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-semibold text-secondary">Top Brands</h2>
      </div>
      <div className="overflow-hidden rounded-[28px] bg-white py-6 shadow-soft">
        <div className="flex w-max gap-4 px-4 hover:[animation-play-state:paused] animate-marquee">
          {repeated.map((brand, index) => (
            <div key={`${brand}-${index}`} className="min-w-44 rounded-full border border-secondary/10 px-6 py-4 text-center text-sm font-semibold text-secondary">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
