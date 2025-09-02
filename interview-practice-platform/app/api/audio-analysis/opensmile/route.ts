import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// OpenSMILE配置文件路径
const OPENSMILE_CONFIG = process.env.OPENSMILE_CONFIG || "/path/to/opensmile/config/emobase2010.conf"
const OPENSMILE_BINARY = process.env.OPENSMILE_BINARY || "SMILExtract"

interface OpenSMILEFeatures {
  // 语速相关特征
  speechRate: number // 语速 (syllables per second)
  articulationRate: number // 发音速率
  speakingRate: number // 说话速率
  
  // 韵律特征
  pitchMean: number // 平均音调
  pitchStd: number // 音调标准差
  energyMean: number // 平均能量
  energyStd: number // 能量标准差
  
  // 停顿特征
  pauseRate: number // 停顿率
  pauseDuration: number // 平均停顿时长
  
  // 语音质量
  jitter: number // 音调抖动
  shimmer: number // 振幅抖动
  hnr: number // 谐噪比
  
  // 情感特征
  valence: number // 效价 (情感积极/消极)
  arousal: number // 唤醒度 (情感强度)
  dominance: number // 支配度
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const audioFile = form.get("audioFile") as File | null
    const username = form.get("username") as string

    if (!audioFile || !username) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少音频文件或用户名" 
      }, { status: 400 })
    }

    // 验证音频文件类型
    const allowedTypes = ["audio/wav", "audio/mp3", "audio/webm", "audio/ogg"]
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json({ 
        success: false, 
        message: "不支持的音频格式，请使用 WAV, MP3, WebM 或 OGG" 
      }, { status: 415 })
    }

    // 创建临时目录
    const tempDir = path.join(process.cwd(), "temp", "opensmile", username)
    await fs.mkdir(tempDir, { recursive: true })

    const timestamp = Date.now()
    const inputPath = path.join(tempDir, `input_${timestamp}.wav`)
    const outputPath = path.join(tempDir, `features_${timestamp}.csv`)

    try {
      // 保存上传的音频文件
      const arrayBuffer = await audioFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await fs.writeFile(inputPath, buffer)

      // 如果输入不是WAV格式，先转换为WAV
      let wavPath = inputPath
      if (!audioFile.type.includes("wav")) {
        wavPath = path.join(tempDir, `converted_${timestamp}.wav`)
        await convertToWav(inputPath, wavPath)
      }

      // 运行OpenSMILE分析
      const features = await runOpenSMILEAnalysis(wavPath, outputPath)

      // 计算语速分析结果
      const analysisResult = calculateSpeechAnalysis(features, audioFile.size)

      // 清理临时文件
      await cleanupTempFiles([inputPath, wavPath, outputPath])

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        message: "语速分析完成"
      })

    } catch (error) {
      // 确保清理临时文件
      await cleanupTempFiles([inputPath, outputPath])
      throw error
    }

  } catch (error) {
    console.error("OpenSMILE分析失败:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "音频分析失败"
    }, { status: 500 })
  }
}

// 转换音频为WAV格式
async function convertToWav(inputPath: string, outputPath: string): Promise<void> {
  try {
    // 使用ffmpeg转换音频格式
    const command = `ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -y "${outputPath}"`
    await execAsync(command)
  } catch (error) {
    throw new Error(`音频格式转换失败: ${error}`)
  }
}

// 运行OpenSMILE分析
async function runOpenSMILEAnalysis(inputPath: string, outputPath: string): Promise<OpenSMILEFeatures> {
  try {
    // 构建OpenSMILE命令
    const command = `"${OPENSMILE_BINARY}" -C "${OPENSMILE_CONFIG}" -I "${inputPath}" -O "${outputPath}"`
    
    console.log("执行OpenSMILE命令:", command)
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr && !stderr.includes("INFO")) {
      console.warn("OpenSMILE警告:", stderr)
    }

    // 读取特征文件
    const features = await parseOpenSMILEOutput(outputPath)
    return features

  } catch (error) {
    throw new Error(`OpenSMILE分析失败: ${error}`)
  }
}

// 解析OpenSMILE输出文件
async function parseOpenSMILEOutput(outputPath: string): Promise<OpenSMILEFeatures> {
  try {
    const content = await fs.readFile(outputPath, 'utf-8')
    const lines = content.trim().split('\n')
    
    if (lines.length < 2) {
      throw new Error("OpenSMILE输出文件格式错误")
    }

    // 解析CSV格式的特征数据
    const header = lines[0].split(',')
    const values = lines[1].split(',')

    const features: OpenSMILEFeatures = {
      speechRate: 0,
      articulationRate: 0,
      speakingRate: 0,
      pitchMean: 0,
      pitchStd: 0,
      energyMean: 0,
      energyStd: 0,
      pauseRate: 0,
      pauseDuration: 0,
      jitter: 0,
      shimmer: 0,
      hnr: 0,
      valence: 0,
      arousal: 0,
      dominance: 0
    }

    // 根据OpenSMILE配置文件映射特征
    header.forEach((featureName, index) => {
      const value = parseFloat(values[index]) || 0
      
      // 语速相关特征
      if (featureName.includes('speechRate') || featureName.includes('speaking_rate')) {
        features.speechRate = value
      }
      if (featureName.includes('articulationRate') || featureName.includes('articulation_rate')) {
        features.articulationRate = value
      }
      
      // 音调特征
      if (featureName.includes('pitchMean') || featureName.includes('F0mean')) {
        features.pitchMean = value
      }
      if (featureName.includes('pitchStd') || featureName.includes('F0std')) {
        features.pitchStd = value
      }
      
      // 能量特征
      if (featureName.includes('energyMean') || featureName.includes('RMSenergy')) {
        features.energyMean = value
      }
      if (featureName.includes('energyStd') || featureName.includes('energyStd')) {
        features.energyStd = value
      }
      
      // 停顿特征
      if (featureName.includes('pauseRate') || featureName.includes('pause_rate')) {
        features.pauseRate = value
      }
      if (featureName.includes('pauseDuration') || featureName.includes('pause_duration')) {
        features.pauseDuration = value
      }
      
      // 语音质量
      if (featureName.includes('jitter') || featureName.includes('Jitter')) {
        features.jitter = value
      }
      if (featureName.includes('shimmer') || featureName.includes('Shimmer')) {
        features.shimmer = value
      }
      if (featureName.includes('hnr') || featureName.includes('HNR')) {
        features.hnr = value
      }
      
      // 情感特征 (如果使用情感分析配置)
      if (featureName.includes('valence')) {
        features.valence = value
      }
      if (featureName.includes('arousal')) {
        features.arousal = value
      }
      if (featureName.includes('dominance')) {
        features.dominance = value
      }
    })

    return features

  } catch (error) {
    throw new Error(`解析OpenSMILE输出失败: ${error}`)
  }
}

// 计算语速分析结果
function calculateSpeechAnalysis(features: OpenSMILEFeatures, fileSize: number) {
  // 基于OpenSMILE特征计算语速评分
  const speechRateScore = calculateSpeechRateScore(features.speechRate)
  const fluencyScore = calculateFluencyScore(features)
  const confidenceScore = calculateConfidenceScore(features)
  const overallScore = (speechRateScore + fluencyScore + confidenceScore) / 3

  return {
    // 语速分析
    speechRate: {
      value: features.speechRate,
      score: speechRateScore,
      level: getSpeechRateLevel(features.speechRate),
      recommendation: getSpeechRateRecommendation(features.speechRate)
    },
    
    // 流畅度分析
    fluency: {
      score: fluencyScore,
      pauseRate: features.pauseRate,
      articulationRate: features.articulationRate,
      recommendation: getFluencyRecommendation(features)
    },
    
    // 自信度分析
    confidence: {
      score: confidenceScore,
      energyLevel: features.energyMean,
      pitchStability: 1 - (features.pitchStd / Math.max(features.pitchMean, 1)),
      recommendation: getConfidenceRecommendation(features)
    },
    
    // 语音质量
    quality: {
      jitter: features.jitter,
      shimmer: features.shimmer,
      hnr: features.hnr,
      score: calculateQualityScore(features)
    },
    
    // 情感分析
    emotion: {
      valence: features.valence,
      arousal: features.arousal,
      dominance: features.dominance
    },
    
    // 总体评分
    overall: {
      score: Math.round(overallScore),
      level: getOverallLevel(overallScore),
      strengths: getStrengths(features),
      improvements: getImprovements(features)
    }
  }
}

// 语速评分计算
function calculateSpeechRateScore(speechRate: number): number {
  // 理想语速范围：120-160 音节/分钟 (2-2.67 音节/秒)
  const idealMin = 2.0
  const idealMax = 2.67
  
  if (speechRate >= idealMin && speechRate <= idealMax) {
    return 90 + (10 * (1 - Math.abs(speechRate - (idealMin + idealMax) / 2) / ((idealMax - idealMin) / 2)))
  } else if (speechRate < idealMin) {
    return Math.max(60, 90 - (idealMin - speechRate) * 20)
  } else {
    return Math.max(60, 90 - (speechRate - idealMax) * 15)
  }
}

// 流畅度评分计算
function calculateFluencyScore(features: OpenSMILEFeatures): number {
  let score = 80
  
  // 停顿率影响 (理想范围：0.1-0.3)
  if (features.pauseRate > 0.3) {
    score -= (features.pauseRate - 0.3) * 50
  }
  
  // 发音速率影响
  if (features.articulationRate < 1.5) {
    score -= 10
  }
  
  return Math.max(60, Math.min(100, score))
}

// 自信度评分计算
function calculateConfidenceScore(features: OpenSMILEFeatures): number {
  let score = 75
  
  // 能量水平影响
  score += (features.energyMean - 0.5) * 20
  
  // 音调稳定性影响
  const pitchStability = 1 - (features.pitchStd / Math.max(features.pitchMean, 1))
  score += pitchStability * 15
  
  return Math.max(60, Math.min(100, score))
}

// 语音质量评分计算
function calculateQualityScore(features: OpenSMILEFeatures): number {
  let score = 80
  
  // 抖动影响
  if (features.jitter > 0.05) {
    score -= features.jitter * 200
  }
  
  // 振幅抖动影响
  if (features.shimmer > 0.1) {
    score -= features.shimmer * 100
  }
  
  // 谐噪比影响
  if (features.hnr < 10) {
    score -= (10 - features.hnr) * 2
  }
  
  return Math.max(60, Math.min(100, score))
}

// 获取语速等级
function getSpeechRateLevel(speechRate: number): string {
  if (speechRate < 1.5) return "过慢"
  if (speechRate < 2.0) return "较慢"
  if (speechRate <= 2.67) return "适中"
  if (speechRate <= 3.0) return "较快"
  return "过快"
}

// 获取语速建议
function getSpeechRateRecommendation(speechRate: number): string {
  if (speechRate < 1.5) {
    return "语速过慢，建议增加说话节奏，避免过长停顿"
  } else if (speechRate < 2.0) {
    return "语速偏慢，可以适当加快节奏，保持流畅性"
  } else if (speechRate <= 2.67) {
    return "语速适中，继续保持良好的节奏感"
  } else if (speechRate <= 3.0) {
    return "语速偏快，建议适当放慢，确保听众能跟上"
  } else {
    return "语速过快，建议显著放慢，增加停顿，让表达更清晰"
  }
}

// 获取流畅度建议
function getFluencyRecommendation(features: OpenSMILEFeatures): string {
  const recommendations = []
  
  if (features.pauseRate > 0.3) {
    recommendations.push("停顿过多，建议减少不必要的停顿")
  }
  
  if (features.articulationRate < 1.5) {
    recommendations.push("发音不够清晰，建议加强咬字练习")
  }
  
  if (recommendations.length === 0) {
    return "流畅度良好，继续保持"
  }
  
  return recommendations.join("；")
}

// 获取自信度建议
function getConfidenceRecommendation(features: OpenSMILEFeatures): string {
  const recommendations = []
  
  if (features.energyMean < 0.4) {
    recommendations.push("声音能量不足，建议提高音量，增强表达力")
  }
  
  const pitchStability = 1 - (features.pitchStd / Math.max(features.pitchMean, 1))
  if (pitchStability < 0.7) {
    recommendations.push("音调不够稳定，建议保持平稳的语调")
  }
  
  if (recommendations.length === 0) {
    return "表达自信，声音稳定"
  }
  
  return recommendations.join("；")
}

// 获取总体等级
function getOverallLevel(score: number): string {
  if (score >= 90) return "优秀"
  if (score >= 80) return "良好"
  if (score >= 70) return "中等"
  if (score >= 60) return "及格"
  return "需改进"
}

// 获取优点
function getStrengths(features: OpenSMILEFeatures): string[] {
  const strengths = []
  
  if (features.speechRate >= 2.0 && features.speechRate <= 2.67) {
    strengths.push("语速适中")
  }
  
  if (features.pauseRate <= 0.3) {
    strengths.push("停顿控制良好")
  }
  
  if (features.energyMean >= 0.5) {
    strengths.push("声音能量充足")
  }
  
  if (features.hnr >= 10) {
    strengths.push("语音质量清晰")
  }
  
  return strengths.length > 0 ? strengths : ["基础表达能力良好"]
}

// 获取改进建议
function getImprovements(features: OpenSMILEFeatures): string[] {
  const improvements = []
  
  if (features.speechRate < 2.0) {
    improvements.push("提高语速，增加表达节奏")
  } else if (features.speechRate > 2.67) {
    improvements.push("适当放慢语速，增加停顿")
  }
  
  if (features.pauseRate > 0.3) {
    improvements.push("减少不必要的停顿")
  }
  
  if (features.energyMean < 0.4) {
    improvements.push("增强声音表达力")
  }
  
  if (features.jitter > 0.05) {
    improvements.push("提高声音稳定性")
  }
  
  return improvements.length > 0 ? improvements : ["继续保持当前水平"]
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
