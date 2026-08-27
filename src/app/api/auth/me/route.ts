import { NextResponse } from "next/server";
import { getSessionUser, getSessionCookieOptions } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}

export async function POST() {
  const cookieOpts = getSessionCookieOptions();
  const response = NextResponse.json({ success: true });
  response.cookies.delete(cookieOpts.name);
  return response;
}
