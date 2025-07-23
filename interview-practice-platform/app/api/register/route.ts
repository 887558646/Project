import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password, role } = await req.json();
  if (!username || !password || !role) {
    return NextResponse.json({ success: false, message: "請填寫完整信息" }, { status: 400 });
  }
  const exist = await prisma.user.findUnique({ where: { username } });
  if (exist) {
    return NextResponse.json({ success: false, message: "用戶名已存在" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, password: hashed, role } });
  return NextResponse.json({ success: true });
} 