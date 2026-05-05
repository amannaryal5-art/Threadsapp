export function LoyaltyCard({ points }: { points: number }) {
  return (
    <div className="rounded-[32px] bg-gradient-to-br from-primary to-orange-400 p-6 text-white shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">Loyalty Points</p>
      <h3 className="mt-3 text-3xl font-bold">🌟 {points.toLocaleString("en-IN")} Points</h3>
      <p className="mt-2 text-sm text-white/75">Unlock private drops, faster shipping perks, and birthday rewards.</p>
    </div>
  );
}
