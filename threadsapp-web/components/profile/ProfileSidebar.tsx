import Link from "next/link";

const links = [
  { href: "/orders", label: "My Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/profile", label: "My Profile" },
  { href: "/profile/addresses", label: "Addresses" },
  { href: "/profile/returns", label: "Returns" }
];

export function ProfileSidebar() {
  return (
    <aside className="rounded-[32px] bg-white p-5 shadow-soft">
      <div className="grid gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-2xl px-4 py-3 text-sm font-medium text-secondary hover:bg-background">
            {link.label}
          </Link>
        ))}
        <button className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-error hover:bg-error/5">Logout</button>
      </div>
    </aside>
  );
}
