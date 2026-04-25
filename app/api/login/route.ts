import { NextResponse } from "next/server";
import { createAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expected = process.env.APP_PASSWORD;
    const secret = process.env.SESSION_SECRET;

    if (!expected || !secret) {
      return NextResponse.json(
        { error: "Server is not configured. Set APP_PASSWORD and SESSION_SECRET." },
        { status: 500 }
      );
    }

    if (typeof password !== "string" || password !== expected) {
      // Slow down brute force attempts a touch
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const token = createAuthToken(secret);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    return response;
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
