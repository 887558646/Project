import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// 实时分析配置
const CHUNK_DURATION = 3 // 每3秒分析一次
const OPENSMILE_BINARY = process.env.OPENSMILE_BINARY || "SMILExtract"
const OPENSMILE_CONFIG = process.env.OPENSMILE_CONFIG || "./config/opensmile/speech_analysis.conf"

interface RealtimeAnalysisResult {
  timestamp: number
  speechRate: number
  energy: number
  pitch: number
  confidence: number
  isSpeaking: boolean
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const audioFile = form.get("audioFile") as File | null
    const username = form.get("username") as string
    const chunkIndex = parseInt(form.get("chunkIndex") as string) || 0

    if (!audioFile || !username) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少音频文件或用户名" 
      }, { status: 400 })
    }

    // 创建临时目录
    const tempDir = path.join(process.cwd(), "temp", "realtime", username)
    await fs.mkdir(tempDir, { recursive: true })

    const timestamp = Date.now()
    const inputPath = path.join(tempDir, `chunk_${chunkIndex}_${timestamp}.wav`)
    const outputPath = path.join(tempDir, `features_${chunkIndex}_${timestamp}.csv`)

    try {
      // 保存音频块
      const arrayBuffer = await audioFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await fs.writeFile(inputPath, buffer)

      // 转换为WAV格式
      const wavPath = path.join(tempDir, `converted_${chunkIndex}_${timestamp}.wav`)
      await convertToWav(inputPath, wavPath)

      // 快速OpenSMILE分析
      const features = await runQuickAnalysis(wavPath, outputPath)

      // 计算实时指标
      const result = calculateRealtimeMetrics(features, chunkIndex)

      // 清理临时文件
      await cleanupTempFiles([inputPath, wavPath, outputPath])

      return NextResponse.json({
        success: true,
        result,
        message: "实时分析完成"
      })

    } catch (error) {
      await cleanupTempFiles([inputPath, outputPath])
      throw error
    }

  } catch (error) {
    console.error("实时分析失败:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "实时分析失败"
    }, { status: 500 })
  }
}

// 快速音频转换
async function convertToWav(inputPath: string, outputPath: string): Promise<void> {
  const command = `ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -t ${CHUNK_DURATION} -y "${outputPath}"`
  await execAsync(command)
}

// 快速OpenSMILE分析
async function runQuickAnalysis(inputPath: string, outputPath: string): Promise<any> {
  const command = `"${OPENSMILE_BINARY}" -C "${OPENSMILE_CONFIG}" -I "${inputPath}" -O "${outputPath}"`
  await execAsync(command)
  
  const content = await fs.readFile(outputPath, 'utf-8')
  const lines = content.trim().split('\n')
  
  if (lines.length < 2) {
    throw new Error("分析输出格式错误")
  }

  const header = lines[0].split(',')
  const values = lines[1].split(',')

  const features: any = {}
  header.forEach((name, index) => {
    features[name] = parseFloat(values[index]) || 0
  })

  return features
}

// 计算实时指标
function calculateRealtimeMetrics(features: any, chunkIndex: number): RealtimeAnalysisResult {
  const speechRate = features.speechRate || 0
  const energy = features.energyMean || 0
  const pitch = features.pitchMean || 0
  const confidence = Math.min(100, Math.max(0, 
    (energy * 50) + (speechRate * 20) + (pitch > 0 ? 30 : 0)
  ))

  return {
    timestamp: Date.now(),
    speechRate,
    energy,
    pitch,
    confidence,
    isSpeaking: energy > 0.1 && speechRate > 0.5
  }
}

// 清理临时文件
async function cleanupTempFiles(filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.warn(`清理临时文件失败: ${filePath}`, error)
    }
  }
}
