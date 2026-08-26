import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, computeSessionValue } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const { passcode } = await request.json();

  if (passcode !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "パスコードが違います。" }, { status: 401 });
  }

  const value = await computeSessionValue(passcode);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
