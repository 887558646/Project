import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ success: false, message: "缺少用戶名" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ success: false, message: "用戶不存在" }, { status: 404 });
    }

    // 獲取用戶的履歷分析歷史
    const history = await prisma.resumeAnalysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalText: true,
        scoreResult: true,
        issuesResult: true,
        rewriteResult: true,
        structureResult: true,
        overallScore: true,
        createdAt: true
      }
    });

    // 解析JSON字段
    const formattedHistory = history.map(item => ({
      ...item,
      scoreResult: JSON.parse(item.scoreResult || '{}'),
      issuesResult: JSON.parse(item.issuesResult || '[]'),
      structureResult: JSON.parse(item.structureResult || '[]'),
      createdAt: item.createdAt.toISOString()
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedHistory
    });
  } catch (error) {
    console.error("獲取履歷分析歷史失敗:", error);
    return NextResponse.json({ success: false, message: "獲取歷史記錄失敗" }, { status: 500 });
  }
} 