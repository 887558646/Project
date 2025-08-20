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
    const q = (searchParams.get('q') || '').trim()
    const take = Math.min(50, Math.max(1, parseInt(searchParams.get('take') || '20', 10)))

    const users = await prisma.user.findMany({
      where: q ? { username: { contains: q } } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
      select: { id: true, username: true, role: true, createdAt: true }
    })

    const userIds = users.map(u => u.id)
    const writtenCounts = await prisma.writtenAnswer.groupBy({ by: ['userId'], _count: { _all: true }, where: { userId: { in: userIds } } })
    const videoCounts = await prisma.videoAnswer.groupBy({ by: ['userId'], _count: { _all: true }, where: { userId: { in: userIds } } })

    const writtenMap = new Map(writtenCounts.map(w => [w.userId, w._count._all]))
    const videoMap = new Map(videoCounts.map(v => [v.userId, v._count._all]))

    const result = users.map(u => ({
      userId: u.id,
      username: u.username,
      writtenCount: writtenMap.get(u.id) || 0,
      videoCount: videoMap.get(u.id) || 0,
    }))

    return NextResponse.json({ success: true, students: result })
  } catch (error) {
    console.error('教師審閱列表失敗:', error)
    return NextResponse.json({ success: false, message: '服務器錯誤' }, { status: 500 })
  }
}


