import { NextRequest, NextResponse } from "next/server"
import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from "@/lib/generated/prisma"

// 在API路由中手動加載環境變量
config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')
    
    console.log("Self-intro History API received:", { username })
    
    if (!username) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少用戶名" 
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

    // 獲取用戶的自我介紹分析歷史
    const history = await prisma.selfIntroAnalysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        introText: true,
        aiAnalysis: true,
        overallScore: true,
        createdAt: true
      }
    })

    // 解析JSON字段
    const formattedHistory = history.map(item => ({
      ...item,
      aiAnalysis: JSON.parse(item.aiAnalysis || '{}'),
      createdAt: item.createdAt.toISOString()
    }))

    console.log("Self-intro history found:", formattedHistory.length, "records")

    return new NextResponse(JSON.stringify({ 
      success: true, 
      data: formattedHistory
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("獲取自我介紹分析歷史失敗:", error)
    return NextResponse.json({ 
      success: false, 
      message: "獲取歷史記錄失敗" 
    }, { status: 500 })
  }
}
