import { NextResponse } from "next/server";
import { SERVER_API_URL } from "@/lib/constants";

const FORWARDED_HEADERS = ["authorization", "content-type"];

async function proxy(request: Request, params: { path?: string[] }) {
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

  const incomingUrl = new URL(request.url);
  const targetPath = params.path?.join("/") ?? "";
  const targetUrl = new URL(`${SERVER_API_URL}/${targetPath}`);
  targetUrl.search = incomingUrl.search;

  const headers = new Headers();
  FORWARDED_HEADERS.forEach((header) => {
    const value = request.headers.get(header);
    if (value) {
      headers.set(header, value);
    }
  });

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const responseHeaders = new Headers();
  const contentType = response.headers.get("content-type");

  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export async function GET(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params);
}

export async function POST(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params);
}

export async function PUT(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params);
}

export async function PATCH(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params);
}

export async function DELETE(request: Request, { params }: { params: { path?: string[] } }) {
  return proxy(request, params);
}
