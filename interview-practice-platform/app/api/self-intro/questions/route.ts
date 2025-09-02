import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import mysql from 'mysql2/promise'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, message: "未授权访问" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ success: false, message: "缺少用户名参数" }, { status: 400 })
    }

    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'interview_platform'
    })

    try {
      // 查询用户的自我介紹個性化問題
      const [rows] = await connection.execute(`
        SELECT 
          sq.question,
          sq.hint,
          sq.category,
          sq.reason,
          sq.createdAt
        FROM SelfIntroPersonalizedQuestion sq
        JOIN SelfIntroAnalysis sa ON sq.selfIntroAnalysisId = sa.id
        JOIN User u ON sa.userId = u.id
        WHERE u.username = ?
        ORDER BY sq.createdAt DESC
        LIMIT 10
      `, [username])

      await connection.end()

      return NextResponse.json({
        success: true,
        questions: rows,
        message: "获取成功"
      })

    } catch (dbError) {
      await connection.end()
      console.error("数据库查询失败:", dbError)
      
      // 如果数据库查询失败，返回空数组
      return NextResponse.json({
        success: true,
        questions: [],
        message: "暂无個性化問題"
      })
    }

  } catch (error) {
    console.error("获取自我介紹個性化問題失败:", error)
    return NextResponse.json({
      success: false,
      message: "获取失败，请稍后重试"
    }, { status: 500 })
  }
}
