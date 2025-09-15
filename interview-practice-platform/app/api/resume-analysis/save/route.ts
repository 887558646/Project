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
    
    console.log("Save API received:", { 
      username, 
      originalText: originalText?.substring(0, 50), 
      hasAnalysisResults: !!analysisResults 
    })
    console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Not set")
    
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

    // 保存履歷分析結果
    const resumeAnalysis = await prisma.resumeAnalysis.create({
      data: {
        userId: user.id,
        originalText: originalText,
        scoreResult: JSON.stringify(analysisResults.scoreResult || {}),
        issuesResult: JSON.stringify(analysisResults.issuesResult || []),
        rewriteResult: analysisResults.rewriteResult || "",
        structureResult: JSON.stringify(analysisResults.structureResult || []),
        overallScore: analysisResults.scoreResult?.overallScore || 0,
        createdAt: new Date()
      }
    })

    console.log("Resume analysis saved:", resumeAnalysis.id)

    return new NextResponse(JSON.stringify({ 
      success: true, 
      data: resumeAnalysis,
      message: "分析結果保存成功"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("保存履歷分析失敗:", error)
    return NextResponse.json({ 
      success: false, 
      message: "保存失敗" 
    }, { status: 500 })
  }
}
