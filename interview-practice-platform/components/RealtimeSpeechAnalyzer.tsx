"use client"

import { useState, useRef, useEffect } from 'react'
import { Volume2, Activity } from 'lucide-react'

interface RealtimeMetrics {
	speechRate: number
	energy: number
	pitch: number
	confidence: number
	isSpeaking: boolean
	timestamp: number
	continuity: number // 语音连续性指标
}

interface RealtimeSpeechAnalyzerProps {
  onMetricsUpdate: (metrics: RealtimeMetrics) => void
  onAnalysisComplete: (fullAnalysis: any) => void
  isActive: boolean
  className?: string
}

export default function RealtimeSpeechAnalyzer({
	onMetricsUpdate,
	onAnalysisComplete,
	isActive,
	className
}: RealtimeSpeechAnalyzerProps) {
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [currentMetrics, setCurrentMetrics] = useState<RealtimeMetrics | null>(null)
	const [audioChunks, setAudioChunks] = useState<Blob[]>([])
	const [speechHistory, setSpeechHistory] = useState<number[]>([]) // 存储语音能量历史
	
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const audioContextRef = useRef<AudioContext | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const animationFrameRef = useRef<number | null>(null)
	const streamRef = useRef<MediaStream | null>(null)

  	// 实时音频分析
	const analyzeRealtime = () => {
		if (!analyserRef.current) return

		const analyser = analyserRef.current
		const bufferLength = analyser.frequencyBinCount
		const dataArray = new Uint8Array(bufferLength)
		
		const analyze = () => {
			analyser.getByteFrequencyData(dataArray)
			
			// 计算能量 (0-1)
			let sum = 0
			for (let i = 0; i < bufferLength; i++) {
				sum += dataArray[i]
			}
			const energy = Math.min(1, sum / bufferLength / 255)

			// 更新语音历史
			setSpeechHistory(prev => {
				const newHistory = [...prev, energy]
				// 只保留最近10个数据点
				return newHistory.slice(-10)
			})

			// 计算语音连续性
			const continuity = calculateSpeechContinuity(speechHistory, energy)

			// 计算语速 (音节/秒，基于能量变化和频率分析)
			const speechRate = calculateSpeechRate(dataArray, energy)

			// 计算音调 (Hz，基于频率分布)
			const pitch = calculatePitch(dataArray, energy)

			// 计算自信度 (综合评分 0-100)
			const confidence = calculateConfidence(energy, speechRate, pitch, continuity)

			const metrics: RealtimeMetrics = {
				speechRate,
				energy: energy * 100, // 转换为百分比
				pitch,
				confidence,
				isSpeaking: energy > 0.05,
				timestamp: Date.now(),
				continuity
			}

			setCurrentMetrics(metrics)
			onMetricsUpdate(metrics)

			if (isActive) {
				animationFrameRef.current = requestAnimationFrame(analyze)
			}
		}

		analyze()
	}

	// 计算语音连续性
	const calculateSpeechContinuity = (history: number[], currentEnergy: number): number => {
		if (history.length < 2) return 50 // 默认中等连续性
		
		// 检测语音中断和流畅度
		const recentEnergies = history.slice(-5)
		const gaps = recentEnergies.filter(energy => energy < 0.05).length
		const highEnergyCount = recentEnergies.filter(energy => energy > 0.15).length
		
		// 基础连续性分数
		let baseScore = 70
		
		// 根据语音中断调整分数
		if (gaps === 0) {
			baseScore += 20 // 无中断，连续性很好
		} else if (gaps === 1) {
			baseScore += 10 // 轻微中断
		} else if (gaps >= 2) {
			baseScore -= gaps * 15 // 多次中断，连续性差
		}
		
		// 根据高能量语音段调整分数
		if (highEnergyCount >= 3) {
			baseScore += 10 // 语音强度稳定
		} else if (highEnergyCount <= 1) {
			baseScore -= 10 // 语音强度不稳定
		}
		
		// 根据当前能量调整
		if (currentEnergy > 0.1) {
			baseScore += 5
		} else if (currentEnergy < 0.05) {
			baseScore -= 10
		}
		
		return Math.min(100, Math.max(0, baseScore))
	}

	// 计算语速
	const calculateSpeechRate = (dataArray: Uint8Array, energy: number): number => {
		if (energy < 0.05) return 0
		
		// 基于能量和频率变化估算语速
		let frequencyChanges = 0
		for (let i = 1; i < dataArray.length; i++) {
			if (Math.abs(dataArray[i] - dataArray[i-1]) > 10) {
				frequencyChanges++
			}
		}
		
		// 语速范围：1.5 - 4.0 音节/秒
		const baseRate = 1.5
		const energyFactor = energy * 1.5
		const changeFactor = Math.min(1, frequencyChanges / 100) * 1.0
		
		return Math.min(4.0, Math.max(1.5, baseRate + energyFactor + changeFactor))
	}

	// 计算音调
	const calculatePitch = (dataArray: Uint8Array, energy: number): number => {
		if (energy < 0.05) return 0
		
		// 找到主要频率
		let maxFreq = 0
		let maxIndex = 0
		for (let i = 0; i < dataArray.length; i++) {
			if (dataArray[i] > maxFreq) {
				maxFreq = dataArray[i]
				maxIndex = i
			}
		}
		
		// 转换为实际频率 (Hz)
		// 采样率通常是 44.1kHz，FFT size 是 2048
		const sampleRate = 44100
		const fftSize = 2048
		const frequency = (maxIndex * sampleRate) / fftSize
		
		// 限制在人类语音范围内 (80Hz - 800Hz)
		return Math.min(800, Math.max(80, frequency))
	}

	// 计算自信度
	const calculateConfidence = (energy: number, speechRate: number, pitch: number, continuity: number): number => {
		// 能量权重 30%
		const energyScore = energy * 30
		
		// 语速权重 25% (语速在2.0-3.5范围内得分最高)
		let speechRateScore = 0
		if (speechRate >= 2.0 && speechRate <= 3.5) {
			speechRateScore = 25
		} else if (speechRate > 0) {
			speechRateScore = Math.max(0, 25 - Math.abs(speechRate - 2.75) * 10)
		}
		
		// 音调权重 20% (音调稳定得分高)
		const pitchScore = pitch > 0 ? 20 : 0
		
		// 连续性权重 25%
		const continuityScore = (continuity / 100) * 25
		
		return Math.min(100, Math.max(0, energyScore + speechRateScore + pitchScore + continuityScore))
	}

  // 开始实时分析
  const startRealtimeAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      })
      
      streamRef.current = stream

      // 设置音频上下文
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      analyserRef.current.smoothingTimeConstant = 0.8

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // 设置录音器
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      const chunks: Blob[] = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        setAudioChunks(prev => [...prev, audioBlob])
      }

      mediaRecorderRef.current.start(1000) // 每秒收集一次数据
      setIsAnalyzing(true)
      analyzeRealtime()

    } catch (error) {
      console.error("启动实时分析失败:", error)
    }
  }

  // 停止实时分析
  const stopRealtimeAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    setIsAnalyzing(false)
  }

  // 发送完整分析到后端
  const sendFullAnalysis = async () => {
    if (audioChunks.length === 0) return

    try {
      const fullAudioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('audioFile', fullAudioBlob, 'realtime_analysis.webm')
      formData.append('username', 'current_user') // 从上下文获取

      const response = await fetch('/api/audio-analysis/opensmile', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        onAnalysisComplete(data.analysis)
      }
    } catch (error) {
      console.error("发送完整分析失败:", error)
    }
  }

  // 清理
  useEffect(() => {
    return () => {
      stopRealtimeAnalysis()
    }
  }, [])

  // 控制分析状态 - 完全自动化，根据isActive自动开始/停止
  useEffect(() => {
    if (isActive && !isAnalyzing) {
      startRealtimeAnalysis()
    } else if (!isActive && isAnalyzing) {
      stopRealtimeAnalysis()
    }
  }, [isActive])

  return (
		<div className={`space-y-4 ${className}`}>
			{/* 状态指示器 - 只显示状态，不提供手动控制 */}
			<div className="flex items-center gap-2">
				<div className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
				<span className="text-sm font-medium text-gray-700">
					{isAnalyzing ? '實時分析中...' : '準備就緒'}
				</span>
			</div>

			{/* 实时指标显示 */}
			{currentMetrics && (
				<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
					{/* 语速 */}
					<div className="bg-white p-3 rounded-lg border text-center">
						<div className="text-xs text-gray-500 mb-1">語速</div>
						<div className="text-lg font-bold text-green-600">
							{currentMetrics.speechRate ? `${currentMetrics.speechRate.toFixed(1)}` : '0'}
						</div>
						<div className="text-xs text-gray-400">音節/秒</div>
					</div>

					{/* 能量 */}
					<div className="bg-white p-3 rounded-lg border text-center">
						<div className="text-xs text-gray-500 mb-1">能量</div>
						<div className="text-lg font-bold text-blue-600">
							{Math.round(currentMetrics.energy || 0)}%
						</div>
						<div className="text-xs text-gray-400">音量強度</div>
					</div>

					{/* 音调 */}
					<div className="bg-white p-3 rounded-lg border text-center">
						<div className="text-xs text-gray-500 mb-1">音調</div>
						<div className="text-lg font-bold text-orange-600">
							{Math.round(currentMetrics.pitch || 0)}
						</div>
						<div className="text-xs text-gray-400">Hz</div>
					</div>

					{/* 自信度 */}
					<div className="bg-white p-3 rounded-lg border text-center">
						<div className="text-xs text-gray-500 mb-1">自信度</div>
						<div className="text-lg font-bold text-purple-600">
							{Math.round(currentMetrics.confidence || 0)}
						</div>
						<div className="text-xs text-gray-400">分</div>
					</div>

					{/* 连续性 */}
					<div className="bg-white p-3 rounded-lg border text-center">
						<div className="text-xs text-gray-500 mb-1">連續性</div>
						<div className="text-lg font-bold text-indigo-600">
							{Math.round(currentMetrics.continuity || 0)}
						</div>
						<div className="text-xs text-gray-400">分</div>
					</div>
				</div>
			)}

			{/* 语音状态指示器 */}
			{currentMetrics && (
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-medium text-gray-700">語音狀態</span>
						<div className={`px-2 py-1 rounded-full text-xs font-medium ${
							currentMetrics.isSpeaking 
								? 'bg-green-100 text-green-800' 
								: 'bg-gray-100 text-gray-800'
						}`}>
							{currentMetrics.isSpeaking ? '正在說話' : '靜音中'}
						</div>
					</div>
					
					{/* 语音波形可视化 */}
					<div className="flex items-end gap-1 h-8">
						{Array.from({ length: 20 }, (_, i) => {
							const height = currentMetrics.isSpeaking 
								? Math.random() * 0.8 + 0.2 
								: 0.1
							return (
								<div
									key={i}
									className="bg-gradient-to-t from-blue-500 to-blue-600 rounded-sm transition-all duration-100"
									style={{ 
										height: `${height * 100}%`,
										width: '3px'
									}}
								/>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}
