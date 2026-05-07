"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";
import { parseApiError } from "@/lib/utils";

interface BroadcastHistoryItem {
  title: string;
  target: string;
  sentCount: number;
  date: string;
}

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState("all_users");
  const [type, setType] = useState("offer");
  const [deepLink, setDeepLink] = useState("{}");
  const [history, setHistory] = useState<BroadcastHistoryItem[]>([]);

  const broadcast = useMutation({
    mutationFn: async () => {
      const parsedData = JSON.parse(deepLink || "{}") as Record<string, string>;
      return api.post("/admin/notifications/broadcast", {
        title,
        body,
        type,
        data: parsedData,
        segment: target === "all_users" ? {} : { role: target === "all_cleaners" ? "cleaner" : undefined },
      });
    },
    onSuccess: () => {
      toast.success("Broadcast sent successfully");
      setHistory((items) => [{ title, target, sentCount: 0, date: new Date().toISOString() }, ...items]);
      setTitle("");
      setBody("");
      setDeepLink("{}");
    },
    onError: (error) => toast.error(parseApiError(error)),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Broadcast Notifications" description="Send push notifications to user segments and preview the final message." />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader><CardTitle>Compose Broadcast</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Title ({title.length}/50)</Label><Input maxLength={50} value={title} onChange={(event) => setTitle(event.target.value)} /></div>
            <div><Label>Body ({body.length}/150)</Label><Textarea maxLength={150} value={body} onChange={(event) => setBody(event.target.value)} /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Target</Label><Select value={target} onValueChange={setTarget}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all_users">All Users</SelectItem><SelectItem value="all_cleaners">All Cleaners</SelectItem><SelectItem value="both">Both</SelectItem></SelectContent></Select></div>
              <div><Label>Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="order">Order</SelectItem><SelectItem value="offer">Offer</SelectItem><SelectItem value="system">System</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label>Deep link data (JSON)</Label><Textarea value={deepLink} onChange={(event) => setDeepLink(event.target.value)} /></div>
            <Button loading={broadcast.isPending} onClick={() => broadcast.mutate()}>Send Broadcast</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Phone Preview</CardTitle></CardHeader>
          <CardContent>
            <div className="mx-auto max-w-xs rounded-[2rem] border border-slate-300 bg-slate-900 p-4 text-white shadow-soft">
              <p className="text-sm font-semibold">{title || "Notification title"}</p>
              <p className="mt-2 text-sm text-white/80">{body || "Notification body preview will appear here."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Broadcast History</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {history.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div><p className="font-medium">{item.title}</p><p className="text-sm text-slate-500">{item.target}</p></div>
              <div className="text-right text-sm text-slate-500"><p>Sent: {item.sentCount}</p><p>{new Date(item.date).toLocaleString()}</p></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
