import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { getSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const session = getSession()
    const username = searchParams.get("username") || session?.username || ""
    const limitRaw = searchParams.get("limit")
    const limit = limitRaw ? Math.min(50, Math.max(1, parseInt(limitRaw, 10))) : 10

    if (!username) {
      return NextResponse.json({ success: false, message: "缺少用戶名" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ success: false, message: "用戶不存在" }, { status: 404 })
    }

    const writtenAnswers = await prisma.writtenAnswer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    const videoAnswers = await prisma.videoAnswer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    // Aggregates for written
    const writtenCount = writtenAnswers.length
    const avgClarity = writtenCount > 0 ? Math.round(writtenAnswers.reduce((s, a) => s + (a.clarityScore || 0), 0) / writtenCount) : 0
    const avgExaggeration = writtenCount > 0 ? Math.round(writtenAnswers.reduce((s, a) => s + (a.exaggerationScore || 0), 0) / writtenCount) : 0

    // Aggregates for video
    const videoCount = videoAnswers.length
    const avgSpeechRate = videoCount > 0 ? Math.round(videoAnswers.reduce((s, a) => s + (a.speechRate || 0), 0) / videoCount) : 0
    const avgEmotionScore = videoCount > 0 ? Math.round(videoAnswers.reduce((s, a) => s + (a.emotionScore || 0), 0) / videoCount) : 0
    const avgDurationSec = videoCount > 0 ? Math.round(videoAnswers.reduce((s, a) => s + (a.durationSec || 0), 0) / videoCount) : 0

    // Simple combined overall score (0-100)
    const writtenComponent = Math.max(0, Math.min(100, avgClarity - Math.round(avgExaggeration * 0.3)))
    const speechComponent = Math.max(0, Math.min(100, avgSpeechRate))
    const emotionComponent = Math.max(0, Math.min(100, avgEmotionScore))
    const overallScore = Math.round(
      (writtenComponent * 0.45 + speechComponent * 0.25 + emotionComponent * 0.30)
    )

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
      written: {
        count: writtenCount,
        avgClarity,
        avgExaggeration,
        items: writtenAnswers,
      },
      video: {
        count: videoCount,
        avgSpeechRate,
        avgEmotionScore,
        avgDurationSec,
        items: videoAnswers,
      },
      combined: {
        overallScore,
      },
    })
  } catch (error) {
    console.error("獲取綜合反饋失敗:", error)
    return NextResponse.json({ success: false, message: "服務器錯誤" }, { status: 500 })
  }
}


