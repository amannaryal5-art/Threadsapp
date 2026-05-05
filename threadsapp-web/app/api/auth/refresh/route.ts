import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL, REFRESH_COOKIE } from "@/lib/constants";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { refreshToken?: string };
  const cookieStore = cookies();
  const refreshToken = body.refreshToken ?? cookieStore.get(REFRESH_COOKIE)?.value;

  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
