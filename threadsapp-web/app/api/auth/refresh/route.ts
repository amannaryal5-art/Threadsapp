import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_COOKIE, SERVER_API_URL } from "@/lib/constants";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { refreshToken?: string };
  const cookieStore = cookies();
  const refreshToken = body.refreshToken ?? cookieStore.get(REFRESH_COOKIE)?.value;

  if (!SERVER_API_URL) {
    return NextResponse.json(
      {
        success: false,
        message: "BACKEND_URL is not configured for this deployment.",
        errors: [],
      },
      { status: 500 },
    );
  }

  const response = await fetch(`${SERVER_API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
