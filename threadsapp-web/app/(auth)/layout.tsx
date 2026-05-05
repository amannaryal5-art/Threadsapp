export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,107,107,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(26,31,54,0.08),_transparent_28%),linear-gradient(135deg,_#fff7f5,_#f6f8fc_42%,_#ffffff)]">
      <div className="container flex min-h-screen items-center py-8 lg:py-12">{children}</div>
    </main>
  );
}
