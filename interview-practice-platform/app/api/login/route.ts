import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";
import { setSessionCookieOnResponse } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ success: false, message: "請填寫完整信息" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ success: false, message: "用戶不存在" }, { status: 404 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ success: false, message: "密碼錯誤" }, { status: 401 });
  }
  // 設置會話 Cookie 在響應上
  const res = NextResponse.json({ success: true, role: user.role, username: user.username })
  setSessionCookieOnResponse(res, { userId: user.id, username: user.username, role: user.role })
  return res
} 