import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "ThreadsApp Admin",
  description: "Admin dashboard for ThreadsApp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-foreground">
        <Providers>
          <AppShell>{children}</AppShell>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
