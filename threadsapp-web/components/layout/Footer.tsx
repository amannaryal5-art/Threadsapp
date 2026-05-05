import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const columns = {
  "About ThreadsApp": ["About Us", "Careers", "Press"],
  Help: ["FAQ", "Track Order", "Returns", "Contact Us"],
  Policy: ["Privacy", "Terms", "Shipping Policy"]
};

export function Footer() {
  return (
    <footer className="mt-20 bg-secondary text-white">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {Object.entries(columns).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{title}</h3>
              <div className="mt-5 grid gap-3 text-sm text-white/75">
                {items.map((item) => (
                  <Link key={item} href="/">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Social</h3>
            <div className="mt-5 flex gap-3 text-lg">
              <FaInstagram />
              <FaFacebookF />
              <FaTwitter />
              <FaYoutube />
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
              {["Visa", "Mastercard", "UPI", "Razorpay", "COD"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/60">© 2024 ThreadsApp. All rights reserved.</p>
          <div className="flex gap-3">
            <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm">App Store</div>
            <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm">Google Play</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
