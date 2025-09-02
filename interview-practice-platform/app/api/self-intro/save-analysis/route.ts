import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, message: "未授权访问" }, { status: 401 })
    }

    const { introText, analysisResults, duration, speechRate, energy, pitch, confidence, continuity } = await req.json()

    if (!introText || !analysisResults) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少必要参数" 
      }, { status: 400 })
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { username: session.username }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "用户不存在" 
      }, { status: 404 })
    }

    // 保存自我介紹分析结果
    const selfIntroAnalysis = await prisma.selfIntroAnalysis.create({
      data: {
        userId: user.id,
        introText: introText,
        duration: duration || 0,
        speechRate: speechRate || null,
        energy: energy || null,
        pitch: pitch || null,
        confidence: confidence || null,
        continuity: continuity || null,
        overallScore: analysisResults.metrics ? 
          (Math.min(100, Math.max(0, 
            ((analysisResults.metrics.speechRate - 1.5) / 2.5) * 100
          )) * 0.25) +
          (Math.min(100, analysisResults.metrics.energy || 0) * 0.25) +
          (Math.min(100, analysisResults.metrics.confidence || 0) * 0.25) +
          (Math.min(100, analysisResults.metrics.continuity || 0) * 0.25) : null
      }
    })

    return NextResponse.json({
      success: true,
      message: "分析结果保存成功",
      analysisId: selfIntroAnalysis.id
    })

  } catch (error) {
    console.error("保存自我介紹分析结果失败:", error)
    return NextResponse.json({
      success: false,
      message: "保存失败，请稍后重试"
    }, { status: 500 })
  }
}
