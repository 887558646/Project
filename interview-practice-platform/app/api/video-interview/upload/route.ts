import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { promises as fs } from "fs"
import path from "path"
import { getSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const session = await getSession()
    const username = (form.get("username") as string) || session?.username || ""
    const questionIdRaw = form.get("questionId") as string | null
    const questionText = (form.get("questionText") as string) || null
    const durationSecRaw = form.get("durationSec") as string | null
    const speechRateRaw = form.get("speechRate") as string | null
    const emotionScoreRaw = form.get("emotionScore") as string | null

    if (!file || !username) {
      return NextResponse.json({ success: false, message: "缺少必要參數" }, { status: 400 })
    }

    // 類型/大小校驗（50MB 限制，常見容器，含音頻）
    const allowedMime = [
      "video/webm", "video/mp4", "video/ogg",
      "audio/webm", "audio/ogg", "audio/mpeg", "audio/wav"
    ]
    const maxBytes = 50 * 1024 * 1024
    if (!allowedMime.includes(file.type)) {
      return NextResponse.json({ success: false, message: "不支持的文件類型" }, { status: 415 })
    }
    const fileSize = typeof (file as any).size === "number" ? (file as any).size : 0
    if (fileSize > maxBytes) {
      return NextResponse.json({ success: false, message: "文件過大，請控制在 50MB 以內" }, { status: 413 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ success: false, message: "用戶不存在" }, { status: 404 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadRoot = path.join(process.cwd(), "public", "uploads", "videos", username)
    await fs.mkdir(uploadRoot, { recursive: true })

    const timestamp = Date.now()
    const mime = file.type || ""
    let ext = path.extname(file.name)
    if (!ext) {
      if (mime === "video/mp4") ext = ".mp4"
      else if (mime === "video/webm") ext = ".webm"
      else if (mime === "video/ogg") ext = ".ogg"
      else if (mime === "audio/webm") ext = ".webm"
      else if (mime === "audio/ogg") ext = ".ogg"
      else if (mime === "audio/mpeg") ext = ".mp3"
      else if (mime === "audio/wav") ext = ".wav"
      else ext = ".dat"
    }
    const filename = `${timestamp}${ext}`
    const filepath = path.join(uploadRoot, filename)

    await fs.writeFile(filepath, buffer)

    const publicPath = path.posix.join("/uploads/videos", username, filename)

    const createData: any = {
        userId: user.id,
        questionId: questionIdRaw ? parseInt(questionIdRaw, 10) : null,
        questionText,
        videoPath: publicPath,
        durationSec: durationSecRaw ? parseInt(durationSecRaw, 10) : 0,
        speechRate: speechRateRaw ? parseInt(speechRateRaw, 10) : null,
        emotionScore: emotionScoreRaw ? parseInt(emotionScoreRaw, 10) : null,
        transcript: null,
        analysisJson: null,
        thumbnailPath: null,
        sizeBytes: fileSize,
        mimeType: file.type || "video/webm"
    }

    const videoAnswer = await prisma.videoAnswer.create({
      data: createData
    })

    return NextResponse.json({ success: true, data: videoAnswer, url: publicPath })
  } catch (error) {
    console.error("上傳錄影失敗:", error)
    return NextResponse.json({ success: false, message: "上傳失敗" }, { status: 500 })
  }
}


