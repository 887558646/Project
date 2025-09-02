import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import mysql from 'mysql2/promise'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, message: "未授权访问" }, { status: 401 })
    }

    const { introText, analysisResults, questions } = await req.json()

    if (!introText || questions === undefined) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少必要参数" 
      }, { status: 400 })
    }

    // questions 允許是字串陣列或物件陣列
    const normalized: { question: string, hint: string, category: string, reason: string }[] =
      (Array.isArray(questions) ? questions : []).map((q: any) => {
        if (typeof q === 'string') return { question: q, hint: '', category: 'personal', reason: '' }
        return {
          question: String(q?.question ?? ''),
          hint: String(q?.hint ?? ''),
          category: String(q?.category ?? 'personal'),
          reason: String(q?.reason ?? '')
        }
      }).filter(x => x.question)

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'interview_platform'
    })

    try {
      await connection.beginTransaction()

      const [userRows] = await connection.execute(
        'SELECT id FROM User WHERE username = ?',
        [session.username]
      )

      if (!Array.isArray(userRows) || userRows.length === 0) {
        throw new Error("用户不存在")
      }

      const userId = (userRows[0] as any).id

      const metrics = analysisResults?.metrics || {}
      const duration = analysisResults?.duration || 0
      const overallScore = metrics ? (
        (Math.min(100, Math.max(0, (((metrics.speechRate ?? 0) - 1.5) / 2.5) * 100)) * 0.25) +
        (Math.min(100, metrics.energy ?? 0) * 0.25) +
        (Math.min(100, metrics.confidence ?? 0) * 0.25) +
        (Math.min(100, metrics.continuity ?? 0) * 0.25)
      ) : null

      const [analysisResult] = await connection.execute(`
        INSERT INTO SelfIntroAnalysis (
          userId, introText, duration, speechRate, energy, pitch, confidence, continuity, overallScore
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        introText,
        duration,
        metrics.speechRate ?? null,
        metrics.energy ?? null,
        metrics.pitch ?? null,
        metrics.confidence ?? null,
        metrics.continuity ?? null,
        overallScore
      ])

      const analysisId = (analysisResult as any).insertId

      // 保存問題
      for (const q of normalized) {
        await connection.execute(`
          INSERT INTO SelfIntroPersonalizedQuestion (
            selfIntroAnalysisId, question, hint, category, reason
          ) VALUES (?, ?, ?, ?, ?)
        `, [
          analysisId,
          q.question,
          q.hint,
          q.category,
          q.reason
        ])
      }

      await connection.commit()
      await connection.end()

      return NextResponse.json({
        success: true,
        message: "保存成功",
        analysisId: analysisId,
        questionsCount: normalized.length
      })

    } catch (dbError) {
      await connection.rollback()
      await connection.end()
      throw dbError
    }

  } catch (error) {
    console.error("保存自我介紹分析結果和個性化問題失败:", error)
    return NextResponse.json({
      success: false,
      message: "保存失败，请稍后重试"
    }, { status: 500 })
  }
}
