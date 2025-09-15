import { NextRequest, NextResponse } from "next/server"
import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from "@/lib/generated/prisma"

// 在API路由中手動加載環境變量
config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { username, originalText, analysisResults } = await req.json()
    
    console.log("Self-intro Save API received:", { 
      username, 
      originalText: originalText?.substring(0, 50), 
      hasAnalysisResults: !!analysisResults 
    })
    
    if (!username || !originalText || !analysisResults) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少必要參數" 
      }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ 
      where: { username } 
    })
    
    if (!user) {
      console.log("User not found:", username)
      return NextResponse.json({ 
        success: false, 
        message: "用戶不存在" 
      }, { status: 404 })
    }

    // 保存自我介紹分析結果
    const selfIntroAnalysis = await prisma.selfIntroAnalysis.create({
      data: {
        userId: user.id,
        introText: originalText,
        duration: 0,
        speechRate: null,
        energy: null,
        pitch: null,
        confidence: null,
        continuity: null,
        overallScore: analysisResults.scoreResult?.overallScore || 0,
        aiAnalysis: JSON.stringify(analysisResults)
      }
    })

    console.log("Self-intro analysis saved:", selfIntroAnalysis.id)

    return new NextResponse(JSON.stringify({ 
      success: true, 
      data: selfIntroAnalysis,
      message: "分析結果保存成功"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("保存自我介紹分析失敗:", error)
    return NextResponse.json({ 
      success: false, 
      message: "保存失敗" 
    }, { status: 500 })
  }
}
