import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// WebSocket连接管理
const connections = new Map<string, WebSocket>()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')
  
  if (!username) {
    return NextResponse.json({ error: "缺少用户名" }, { status: 400 })
  }

  // 这里应该返回WebSocket升级响应
  // 由于Next.js API路由限制，建议使用专门的WebSocket服务器
  return NextResponse.json({ 
    message: "WebSocket连接需要专门的服务器实现",
    suggestion: "使用Socket.io或原生WebSocket服务器"
  })
}

// 处理音频流数据
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const audioChunk = form.get("audioChunk") as File | null
    const username = form.get("username") as string
    const timestamp = form.get("timestamp") as string

    if (!audioChunk || !username) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少音频数据或用户名" 
      }, { status: 400 })
    }

    // 快速分析音频块
    const analysis = await quickAnalyzeAudioChunk(audioChunk)
    
    // 实时反馈
    const realtimeResult = {
      timestamp: parseInt(timestamp) || Date.now(),
      speechRate: analysis.speechRate,
      energy: analysis.energy,
      pitch: analysis.pitch,
      confidence: analysis.confidence,
      isSpeaking: analysis.isSpeaking,
      recommendations: getRealtimeRecommendations(analysis)
    }

    return NextResponse.json({
      success: true,
      result: realtimeResult,
      message: "实时分析完成"
    })

  } catch (error) {
    console.error("流分析失败:", error)
    return NextResponse.json({
      success: false,
      message: "流分析失败"
    }, { status: 500 })
  }
}

// 快速音频块分析
async function quickAnalyzeAudioChunk(audioChunk: File): Promise<any> {
  // 简化的快速分析，不依赖OpenSMILE
  const arrayBuffer = await audioChunk.arrayBuffer()
  const audioBuffer = new Float32Array(arrayBuffer)
  
  // 计算基本音频特征
  let sum = 0
  let max = 0
  let zeroCrossings = 0
  
  for (let i = 0; i < audioBuffer.length; i++) {
    const sample = Math.abs(audioBuffer[i])
    sum += sample
    max = Math.max(max, sample)
    
    if (i > 0 && (audioBuffer[i] * audioBuffer[i-1]) < 0) {
      zeroCrossings++
    }
  }
  
  const energy = sum / audioBuffer.length
  const speechRate = energy > 0.01 ? 2.0 + (energy * 2) : 0
  const pitch = zeroCrossings / (audioBuffer.length / 16000) // 估算基频
  const confidence = Math.min(100, energy * 1000)
  const isSpeaking = energy > 0.01

  return {
    speechRate,
    energy,
    pitch,
    confidence,
    isSpeaking
  }
}

// 实时建议
function getRealtimeRecommendations(analysis: any): string[] {
  const recommendations = []
  
  if (analysis.speechRate < 1.5) {
    recommendations.push("语速偏慢，建议加快节奏")
  } else if (analysis.speechRate > 3.0) {
    recommendations.push("语速过快，建议放慢")
  }
  
  if (analysis.energy < 0.05) {
    recommendations.push("音量偏小，建议提高声音")
  }
  
  if (analysis.confidence < 60) {
    recommendations.push("表达不够自信，建议增强语气")
  }
  
  return recommendations
}
