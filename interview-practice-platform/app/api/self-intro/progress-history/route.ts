import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { getSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, message: "未授权访问" }, { status: 401 })
    }

    // 讀取自我介紹的分析歷史（由舊到新）
    const analyses = await prisma.selfIntroAnalysis.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        createdAt: true,
        introText: true,
        duration: true,
        speechRate: true,
        energy: true,
        pitch: true,
        confidence: true,
        continuity: true,
        overallScore: true,
        aiAnalysis: true
      }
    })

    const history = analyses.map(a => ({
      id: a.id,
      timestamp: a.createdAt.getTime(),
      date: a.createdAt.toISOString(),
      introText: a.introText,
      duration: a.duration || 0,
      metrics: {
        speechRate: a.speechRate ?? null,
        energy: a.energy ?? null,
        pitch: a.pitch ?? null,
        confidence: a.confidence ?? null,
        continuity: a.continuity ?? null
      },
      overallScore: a.overallScore ?? 0,
      aiAnalysis: a.aiAnalysis ? JSON.parse(a.aiAnalysis) : null
    }))

    return NextResponse.json({ success: true, data: history })
  } catch (error) {
    console.error("獲取自我介紹進步歷史失敗:", error)
    return NextResponse.json({ success: false, message: "獲取數據失敗" }, { status: 500 })
  }
}
