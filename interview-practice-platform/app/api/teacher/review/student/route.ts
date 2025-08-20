import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { getSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = getSession()
    if (!session || session.role !== 'teacher') {
      return NextResponse.json({ success: false, message: '未授權' }, { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const userIdRaw = searchParams.get('userId')
    if (!userIdRaw) return NextResponse.json({ success: false, message: '缺少 userId' }, { status: 400 })
    const userId = parseInt(userIdRaw, 10)

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, role: true } })
    if (!user) return NextResponse.json({ success: false, message: '用戶不存在' }, { status: 404 })

    const writtenAnswers = await prisma.writtenAnswer.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 })
    const videoAnswers = await prisma.videoAnswer.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 })
    const comments = await prisma.teacherComment.findMany({ where: { studentUserId: userId }, orderBy: { createdAt: 'desc' }, take: 100 })

    return NextResponse.json({ success: true, user, writtenAnswers, videoAnswers, comments })
  } catch (error) {
    console.error('教師獲取學生詳情失敗:', error)
    return NextResponse.json({ success: false, message: '服務器錯誤' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSession()
    if (!session || session.role !== 'teacher') {
      return NextResponse.json({ success: false, message: '未授權' }, { status: 401 })
    }

    const body = await req.json()
    const { studentUserId, targetType, videoAnswerId, questionId, comment, score } = body
    if (!studentUserId || !targetType || !comment) {
      return NextResponse.json({ success: false, message: '缺少必要參數' }, { status: 400 })
    }

    const created = await prisma.teacherComment.create({
      data: {
        studentUserId,
        teacherUserId: session.userId,
        targetType,
        videoAnswerId: videoAnswerId || null,
        questionId: questionId || null,
        comment,
        score: typeof score === 'number' ? score : null,
      }
    })

    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error('教師提交評論失敗:', error)
    return NextResponse.json({ success: false, message: '服務器錯誤' }, { status: 500 })
  }
}


