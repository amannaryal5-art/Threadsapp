export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fabric-bg relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_20%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_45%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              ThreadsApp admin
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-white">
              A cleaner command center for catalog, orders, and growth.
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/72">
              Keep merchandising, returns, customers, and campaigns in one professional workspace built for everyday operations.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ["Catalog control", "Launch products, update stock, and manage banners without losing context."],
                ["Operational clarity", "Surface returns, low-stock alerts, and order states before they become problems."],
                ["Team-ready analytics", "Give admins a tighter view of daily revenue, top categories, and product momentum."],
                ["Safer access", "Centralize your admin actions inside a dedicated authenticated workspace."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-3xl border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/64">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
