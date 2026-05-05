import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, ShieldCheck, Sparkles, Truck } from "lucide-react";

interface AuthShellProps {
  title: string;
  eyebrow: string;
  description: string;
  alternateHref: Route;
  alternateLabel: string;
  alternateText: string;
  children: ReactNode;
}

const perks = [
  {
    icon: Truck,
    title: "Fast doorstep delivery",
    description: "Track orders, save addresses, and checkout faster."
  },
  {
    icon: ShieldCheck,
    title: "Secure shopping",
    description: "Your wishlist, profile, and payments stay protected."
  },
  {
    icon: Sparkles,
    title: "Made for repeat shoppers",
    description: "Get early sale access, loyalty perks, and easier reorders."
  }
];

export function AuthShell({
  title,
  eyebrow,
  description,
  alternateHref,
  alternateLabel,
  alternateText,
  children
}: AuthShellProps) {
  return (
    <div className="grid overflow-hidden rounded-[40px] border border-white/70 bg-white/90 shadow-card backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-secondary px-6 py-10 text-white sm:px-10 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,107,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.14),_transparent_25%)]" />
        <div className="relative flex h-full flex-col">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            Threads<span className="text-primary">App</span>
          </Link>
          <div className="mt-12 max-w-md">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              {eyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/72 sm:text-base">{description}</p>
          </div>

          <div className="mt-10 grid gap-4">
            {perks.map(({ icon: Icon, title: perkTitle, description: perkDescription }) => (
              <div key={perkTitle} className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{perkTitle}</p>
                    <p className="mt-1 text-sm leading-6 text-white/68">{perkDescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/8 p-5 text-sm text-white/78">
            <p className="font-semibold text-white">Why create an account?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Saved wishlist
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Faster checkout
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Order tracking
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Easy returns
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center bg-[linear-gradient(180deg,_rgba(248,248,248,0.9),_white)] px-6 py-10 sm:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-[32px] border border-secondary/8 bg-white p-6 shadow-soft sm:p-8">
            {children}
          </div>
          <p className="mt-5 text-center text-sm text-secondary/60">
            {alternateText}{" "}
            <Link href={alternateHref} className="inline-flex items-center gap-1 font-semibold text-primary">
              {alternateLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
