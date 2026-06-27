import { NextResponse } from "next/server";

const COOKIE_NAME = "auth-token";

export async function POST(request: Request) {
  const { password } = await request.json();
  const secret = process.env.API_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "API_SECRET이 설정되지 않았습니다" }, { status: 500 });
  }

  if (password !== secret) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
