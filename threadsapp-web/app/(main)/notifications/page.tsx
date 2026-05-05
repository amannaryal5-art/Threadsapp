"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useNotifications } from "@/hooks/useAuth";

export default function NotificationsPage() {
  const { data } = useNotifications();
  const notifications = data?.data.notifications ?? [];

  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar />
        <div className="rounded-[32px] bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-bold text-secondary">Notifications</h1>
          <div className="mt-6 space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-secondary/10 p-4">
                <p className="font-semibold text-secondary">{notification.title}</p>
                <p className="mt-2 text-sm text-secondary/60">{notification.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
