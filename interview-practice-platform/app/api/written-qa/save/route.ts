import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username: bodyUsername, questionId, answer, analysis } = await req.json();
    const session = getSession()
    const username = session?.username || bodyUsername
    
    if (!username || !questionId || !answer) {
      return NextResponse.json({ success: false, message: "缺少必要參數" }, { status: 400 });
    }

    // 獲取用戶ID
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ success: false, message: "用戶不存在" }, { status: 404 });
    }

    // 保存或更新答案
    const writtenAnswer = await prisma.writtenAnswer.upsert({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: questionId
        }
      },
      update: {
        answer: answer,
        wordCount: analysis.wordCount,
        clarityScore: analysis.clarityScore,
        exaggerationScore: analysis.exaggerationScore,
        issues: JSON.stringify(analysis.issues)
      },
      create: {
        userId: user.id,
        questionId: questionId,
        answer: answer,
        wordCount: analysis.wordCount,
        clarityScore: analysis.clarityScore,
        exaggerationScore: analysis.exaggerationScore,
        issues: JSON.stringify(analysis.issues)
      }
    });

    return NextResponse.json({ success: true, data: writtenAnswer });
  } catch (error) {
    console.error("保存書面問答失敗:", error);
    return NextResponse.json({ success: false, message: "保存失敗" }, { status: 500 });
  }
} 