import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user.types";
import type { Order } from "@/types/order.types";
import { UserOrderHistory } from "@/components/users/UserOrderHistory";
import { formatCurrency, formatDate } from "@/lib/utils";

export function UserDetail({ user, orders }: { user: User; orders: Order[] }) {
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div><p className="font-medium">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p><p className="text-sm text-slate-500">{user.phone}</p></div>
          <div><p className="text-sm text-slate-500">Gender: {user.gender ?? "N/A"}</p><p className="text-sm text-slate-500">DOB: {user.dateOfBirth ? formatDate(user.dateOfBirth) : "N/A"}</p><p className="text-sm text-slate-500">Joined: {formatDate(user.createdAt)}</p></div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Total Orders</p><p className="text-2xl font-semibold">{orders.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Total Spent</p><p className="text-2xl font-semibold">{formatCurrency(totalSpent)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Loyalty Points</p><p className="text-2xl font-semibold">{user.loyaltyPoints}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-slate-500">Addresses</p><p className="text-2xl font-semibold">{user.addresses?.length ?? 0}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
        <CardContent><UserOrderHistory orders={orders} /></CardContent>
      </Card>
    </div>
  );
}
