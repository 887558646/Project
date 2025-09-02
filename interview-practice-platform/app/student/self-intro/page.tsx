"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mic, MicOff, Volume2, Lightbulb, Target, Clock, Play, Square, RotateCcw, MessageSquare } from "lucide-react"
import RealtimeSpeechAnalyzer from "@/components/RealtimeSpeechAnalyzer"

export default function SelfIntroPage() {
	const router = useRouter()
	const [introText, setIntroText] = useState("")
	const [isIntroActive, setIsIntroActive] = useState(false)
	const [remainSec, setRemainSec] = useState(120)
	const [isCounting, setIsCounting] = useState(false)
	const [personalizedQuestions, setPersonalizedQuestions] = useState<any[]>([])
	const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
	const [realtimeMetrics, setRealtimeMetrics] = useState<any>(null)
	const [useRealtimeAnalysis, setUseRealtimeAnalysis] = useState(true) // 默认启用实时分析
	const [analysisHistory, setAnalysisHistory] = useState<any[]>([])
	const [currentSessionData, setCurrentSessionData] = useState<any>(null)
	// 生成完成/失敗狀態，用於控制按鈕與提示
	const [genCompleted, setGenCompleted] = useState(false)
	const [genFailed, setGenFailed] = useState(false)
	// 分析建議
	const [suggestions, setSuggestions] = useState<string[]>([])
	// 完成流程狀態
	const [isFinishing, setIsFinishing] = useState(false)
	// AI 分析（文字→與書面一致）
	const [isRunningAi, setIsRunningAi] = useState(false)
	const [aiAnalysis, setAiAnalysis] = useState<any>(null)

	// 语音识别相关状态
	const [isListening, setIsListening] = useState(false)
	const [transcript, setTranscript] = useState("")
	const recognitionRef = useRef<any>(null)

	// 计时器效果
	useEffect(() => {
		let interval: NodeJS.Timeout
		if (isCounting && remainSec > 0) {
			interval = setInterval(() => {
				setRemainSec(prev => {
					if (prev <= 1) {
						setIsCounting(false)
						setIsIntroActive(false)
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}
		return () => clearInterval(interval)
	}, [isCounting, remainSec])

	// 初始化语音识别
	useEffect(() => {
		if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
			const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
			recognitionRef.current = new SpeechRecognition()
			recognitionRef.current.continuous = true
			recognitionRef.current.interimResults = true
			recognitionRef.current.lang = 'zh-TW'
			
			recognitionRef.current.onresult = (event: any) => {
				let finalTranscript = ''
				let interimTranscript = ''
				
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript
					if (event.results[i].isFinal) {
						finalTranscript += transcript
					} else {
						interimTranscript += transcript
					}
				}
				
				if (finalTranscript) {
					setIntroText(prev => prev + finalTranscript)
				}
				setTranscript(interimTranscript)
			}
			
			recognitionRef.current.onerror = (event: any) => {
				console.error('语音识别错误:', event.error)
				setIsListening(false)
			}
		}
		// 初始化讀取歷史，對齊書面流程
		;(async () => {
			try {
				const res = await fetch('/api/self-intro/progress-history')
				const data = await res.json()
				if (data.success && Array.isArray(data.data)) {
					setAnalysisHistory(data.data)
				}
			} catch {}
		})()
	}, [])

	// 依據目前內容與指標更新建議
	const updateSuggestions = (text: string, metrics?: any) => {
		const adv: string[] = []
		const len = (text || '').trim().length
		if (len < 200) adv.push("內容偏短，建議補充1-2個具體例子或成就，提升說服力。")
		if (len > 350) adv.push("內容略長，建議精煉重點至200-300字，避免資訊過載。")

		if (metrics) {
			const rate = Number(metrics.speechRate ?? 0)
			if (rate && (rate < 2.0 || rate > 3.5)) adv.push("語速未在理想區間（2.0-3.5），可適度調整以提升清晰度。")
			const energy = Number(metrics.energy ?? 0)
			if (energy < 40) adv.push("聲音能量偏低，建議提高音量與語氣變化，展現自信。")
			const conf = Number(metrics.confidence ?? 0)
			if (conf < 70) adv.push("自信度略低，可使用肯定語氣與直述句，減少語尾上揚。")
			const cont = Number(metrics.continuity ?? 0)
			if (cont < 75) adv.push("連續性有提升空間，建議以過渡語（首先/接著/最後）串聯段落。")
		}

		// 簡單偵測口頭填充詞
		const filler = (text.match(/(嗯|就是|然後|那個|其實)/g) || []).length
		if (filler >= 3) adv.push("口頭填充詞稍多，建議停頓取代填充詞，讓表達更乾淨。")

		if (adv.length === 0) adv.push("表現穩定！可再加入一個可量化成果，讓亮點更突出。")
		setSuggestions(adv)
	}

	// 开始自我介绍
	const startIntro = () => {
		setIsIntroActive(true)
		setIsCounting(true)
		setRemainSec(120)
		setIntroText("")
		setTranscript("")
		setCurrentSessionData(null)
		// 清空之前的分析历史
		setAnalysisHistory([])
		// 重置個性化問題生成狀態
		setGenCompleted(false)
		setGenFailed(false)
		setSuggestions([])
		
		// 开始语音识别
		if (recognitionRef.current) {
			recognitionRef.current.start()
			setIsListening(true)
		}
	}

	// 停止自我介绍
	const stopIntro = async () => {
		setIsIntroActive(false)
		setIsCounting(false)
		setIsListening(false)
		
		// 停止语音识别
		if (recognitionRef.current) {
			recognitionRef.current.stop()
		}
		
		// 保存当前会话数据
		let sessionData: any = null
		if (realtimeMetrics) {
			sessionData = {
				timestamp: Date.now(),
				duration: 120 - remainSec,
				metrics: realtimeMetrics,
				text: introText
			}
			setCurrentSessionData(sessionData)
			setAnalysisHistory(prev => [...prev, sessionData])
			updateSuggestions(introText, realtimeMetrics)
		} else {
			updateSuggestions(introText)
		}

		// 鏡像書面流程：自動保存分析與生成個性化題目
		try {
			// 保存分析
			await fetch('/api/self-intro/save-analysis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					introText,
					analysisResults: sessionData || { duration: 120 - remainSec, metrics: realtimeMetrics },
					duration: (sessionData?.duration) || (120 - remainSec),
					speechRate: sessionData?.metrics?.speechRate || realtimeMetrics?.speechRate,
					energy: sessionData?.metrics?.energy || realtimeMetrics?.energy,
					pitch: sessionData?.metrics?.pitch || realtimeMetrics?.pitch,
					confidence: sessionData?.metrics?.confidence || realtimeMetrics?.confidence,
					continuity: sessionData?.metrics?.continuity || realtimeMetrics?.continuity
				})
			})
			// 生成並保存個性化題目（與書面一致）
			await fetch('/api/self-intro/generate-questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ introText, analysisResults: sessionData || { duration: 120 - remainSec, metrics: realtimeMetrics } })
			})
		} catch (e) {
			console.warn('自動保存/生成題目失敗(可稍後再試):', e)
		}
	}

	// 重置
	const resetIntro = () => {
		setIsIntroActive(false)
		setIsCounting(false)
		setRemainSec(120)
		setIntroText("")
		setTranscript("")
		setIsListening(false)
		setRealtimeMetrics(null)
		setCurrentSessionData(null)
		setAnalysisHistory([])
		setGenCompleted(false)
		setGenFailed(false)
		setSuggestions([])
		
		// 停止语音识别
		if (recognitionRef.current) {
			recognitionRef.current.stop()
		}
	}

	// 生成个性化问题
	const generatePersonalizedQuestions = async () => {
		if (!introText.trim()) {
			alert("请先完成自我介绍")
			return
		}

		setIsGeneratingQuestions(true)
		try {
			const response = await fetch("/api/self-intro/generate-questions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					introText,
					// 語音分析可選：如果有則一併提供，沒有則僅以文字生成
					analysisResults: currentSessionData || undefined
				})
			})

			const data = await response.json()
			if (data.success) {
				setPersonalizedQuestions(data.questions || [])
				setGenCompleted(true)
				setGenFailed(false)
			} else {
				// 失敗時改為只保存自我介紹與空問題
				await fetch("/api/self-intro/save-with-questions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						introText,
						analysisResults: currentSessionData || undefined,
						questions: []
					})
				})
				setPersonalizedQuestions([])
				setGenCompleted(true)
				setGenFailed(true)
			}
		} catch (error) {
			console.error("生成问题失败:", error)
			// 失敗時改為只保存自我介紹與空問題
			try {
				await fetch("/api/self-intro/save-with-questions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						introText,
						analysisResults: currentSessionData || undefined,
						questions: []
					})
				})
			} catch {}
			setPersonalizedQuestions([])
			setGenCompleted(true)
			setGenFailed(true)
		} finally {
			setIsGeneratingQuestions(false)
		}
	}

	// 保存分析结果
	const saveAnalysis = async () => {
		if (!currentSessionData) return

		try {
			const response = await fetch('/api/self-intro/save-analysis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					introText,
					analysisResults: currentSessionData,
					duration: currentSessionData.duration,
					speechRate: currentSessionData.metrics.speechRate,
					energy: currentSessionData.metrics.energy,
					pitch: currentSessionData.metrics.pitch,
					confidence: currentSessionData.metrics.confidence,
					continuity: currentSessionData.metrics.continuity
				})
			})
			
			const data = await response.json()
			if (data.success) {
				alert("分析结果已保存！")
			} else {
				alert("保存失败：" + data.message)
			}
		} catch (error) {
			console.error("保存失败:", error)
			alert("保存失败，请稍后重试")
		}
	}

	// 完成流程：保存分析 -> 生成題目 -> 前往綜合練習
	const handleFinish = async () => {
		if (isIntroActive) {
			alert('請先停止自我介紹，再點擊完成')
			return
		}
		if (!introText.trim()) {
			alert('請先輸入自我介紹內容')
			return
		}
		setIsFinishing(true)
		try {
			// 準備會話資料
			const sessionData = currentSessionData || {
				duration: 120 - remainSec,
				metrics: realtimeMetrics || {}
			}
			// 1) 保存分析
			await fetch('/api/self-intro/save-analysis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					introText,
					analysisResults: sessionData,
					duration: sessionData.duration || 0,
					speechRate: sessionData.metrics?.speechRate,
					energy: sessionData.metrics?.energy,
					pitch: sessionData.metrics?.pitch,
					confidence: sessionData.metrics?.confidence,
					continuity: sessionData.metrics?.continuity
				})
			})
			// 2) 生成並保存個性化題目
			await fetch('/api/self-intro/generate-questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ introText, analysisResults: sessionData })
			})
			// 3) 導向綜合練習
			router.push('/student/combined-practice')
		} catch (e) {
			console.error('完成流程失敗:', e)
			// 即使失敗也導向，避免卡住
			router.push('/student/combined-practice')
		} finally {
			setIsFinishing(false)
		}
	}

	// 觸發 AI 分析（僅依文字，與書面一致）
	const runAiAnalysis = async () => {
		console.log('=== AI分析按鈕被點擊 ===')
		console.log('introText:', introText)
		console.log('introText.trim():', introText.trim())
		console.log('introText.length:', introText.length)
		console.log('isRunningAi:', isRunningAi)
		
		if (!introText.trim()) {
			console.log('文字為空，顯示警告')
			alert('請先輸入自我介紹內容')
			return
		}
		
		console.log('開始AI分析...')
		setIsRunningAi(true)
		
		try {
			console.log('發送API請求到 /api/self-intro/ai-analysis')
			const res = await fetch('/api/self-intro/ai-analysis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ introText })
			})
			console.log('API回應狀態:', res.status)
			console.log('API回應headers:', res.headers)
			
			const data = await res.json()
			console.log('API回應數據:', data)
			
			if (data.success) {
				console.log('AI分析成功，設置結果')
				setAiAnalysis(data.result)
				alert('AI分析完成！')
			} else {
				console.log('AI分析失敗:', data.message)
				alert(data.message || 'AI 分析失敗，稍後再試')
			}
		} catch (e) {
			console.error('AI 分析異常:', e)
			alert('AI 分析失敗，稍後再試')
		} finally {
			console.log('設置 isRunningAi 為 false')
			setIsRunningAi(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			{/* Header */}
			<header className="bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center h-16 sm:h-20">
						<Button 
							variant="ghost" 
							onClick={() => router.push("/student/dashboard")} 
							className="mr-4 sm:mr-6 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200"
						>
							<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
							<span className="hidden sm:inline">返回儀表板</span>
						</Button>
						<div className="flex items-center gap-2 sm:gap-3">
							<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
								<Mic className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
							</div>
							<h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
								自我介紹練習
							</h1>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* 左侧：自我介绍输入和控制 */}
					<div className="lg:col-span-2 space-y-6">
						{/* 主要控制区域 */}
						<Card className="bg-white/80 backdrop-blur-sm border border-pink-200/50 shadow-xl rounded-2xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-pink-800">
									<Mic className="w-5 h-5" />
									語音練習控制
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* 计时器显示 */}
								<div className="flex items-center justify-center">
									<div className="text-center">
										<div className="flex items-center gap-2 mb-2">
											<Clock className="w-5 h-5 text-pink-600" />
											<span className="text-sm font-medium text-gray-600">剩餘時間</span>
										</div>
										<div className="text-4xl font-bold text-pink-600">
											{Math.floor(remainSec / 60)}:{(remainSec % 60).toString().padStart(2, '0')}
										</div>
									</div>
								</div>

								{/* 控制按钮 */}
								<div className="flex gap-3 justify-center">
									{!isIntroActive ? (
										<Button 
											onClick={startIntro}
											className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
										>
											<Play className="w-5 h-5 mr-2" />
											開始自我介紹
										</Button>
									) : (
										<Button 
											onClick={stopIntro}
											variant="destructive"
											className="px-8 py-3 text-lg"
										>
											<Square className="w-5 h-5 mr-2" />
											停止自我介紹
										</Button>
									)}
									
									<Button 
										onClick={resetIntro}
										variant="outline"
										className="px-6 py-3"
									>
										<RotateCcw className="w-4 h-4 mr-2" />
										重置
									</Button>
								</div>

								{/* 状态指示器 */}
								<div className="flex items-center justify-center gap-2">
									<div className={`w-3 h-3 rounded-full ${
										isIntroActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
									}` } />
									<span className="text-sm text-gray-600">
										{isIntroActive ? '練習進行中...' : '準備就緒'}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* 实时语音分析器 */}
						{useRealtimeAnalysis && (
							<Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-2xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-blue-800">
										<Volume2 className="w-5 h-5" />
										實時語音分析 (自動)
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
										<div className="text-sm text-blue-700">
											💡 實時語音分析會在開始自我介紹時自動啟動，無需手動操作
										</div>
									</div>
									<RealtimeSpeechAnalyzer 
										onMetricsUpdate={setRealtimeMetrics}
										onAnalysisComplete={() => {}}
										isActive={isIntroActive}
									/>
								</CardContent>
							</Card>
						)}

						{/* 文本输入区域 */}
						<Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-2xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-gray-800">
									<Mic className="w-5 h-5" />
									自我介紹內容
								</CardTitle>
							</CardHeader>
							<CardContent>
								{/* 语音识别状态 */}
								{isListening && (
									<div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
										<div className="flex items-center gap-2 text-green-700">
											<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
											<span className="text-sm font-medium">語音識別中...</span>
										</div>
										{transcript && (
											<div className="mt-2 text-sm text-green-600">
												正在識別：{transcript}
											</div>
										)}
									</div>
								)}
								
								<Textarea
									placeholder="在這裡輸入或記錄你的自我介紹內容..."
									value={introText}
									onChange={(e) => setIntroText(e.target.value)}
									className="min-h-[200px] resize-none"
									disabled={isIntroActive}
								/>
								<div className="mt-2 text-sm text-gray-500">
									字數：{introText.length} / 建議 200-300 字
								</div>
							</CardContent>
						</Card>
					</div>

					{/* 右侧：分析结果和行动建议 */}
					<div className="space-y-6">
						{/* 分析建議 */}
						{suggestions.length > 0 && (
							<Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-xl rounded-2xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-emerald-800">
										<MessageSquare className="w-5 h-5" />
										分析建議
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="list-disc pl-5 space-y-2 text-sm text-emerald-800">
										{suggestions.map((s, i) => (
											<li key={i}>{s}</li>
										))}
									</ul>
								</CardContent>
							</Card>
						)}

						{/* 当前会话分析结果 */}
						{currentSessionData && (
							<Card className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200/50 shadow-xl rounded-2xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-green-800">
										<Target className="w-5 h-5" />
										本次練習結果
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* 分數條顯示 */}
									<div className="space-y-3">
										<div className="bg-white p-3 rounded-lg border">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">語音表現</span>
												<span className="text-lg font-bold text-green-600">
													{currentSessionData.metrics.speechRate ? 
														`${currentSessionData.metrics.speechRate.toFixed(1)} 音節/秒` : 
														'無數據'
													}
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
													style={{ 
														width: `${Math.min(100, Math.max(0, 
															((currentSessionData.metrics.speechRate - 1.5) / 2.5) * 100
														))}%` 
													}}
												></div>
											</div>
											<div className="text-xs text-gray-500 mt-1">
												標準：2.0-3.5 音節/秒 | 優秀：≥3.0 | 良好：2.5-2.9 | 需改進：≤2.4
											</div>
										</div>

										<div className="bg-white p-3 rounded-lg border">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">語音能量</span>
												<span className="text-lg font-bold text-blue-600">
													{Math.round(currentSessionData.metrics.energy || 0)}%
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
													style={{ width: `${Math.round(currentSessionData.metrics.energy || 0)}%` }}
												></div>
											</div>
											<div className="text-xs text-gray-500 mt-1">
												標準：20-80% | 優秀：≥60% | 良好：40-59% | 需改進：≤39%
											</div>
										</div>

										<div className="bg-white p-3 rounded-lg border">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">自信度</span>
												<span className="text-lg font-bold text-purple-600">
													{Math.round(currentSessionData.metrics.confidence || 0)}分
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
													style={{ width: `${Math.round(currentSessionData.metrics.confidence || 0)}%` }}
												></div>
											</div>
											<div className="text-xs text-gray-500 mt-1">
												標準：60-100分 | 優秀：≥85 | 良好：70-84 | 需改進：≤69
											</div>
										</div>

										<div className="bg-white p-3 rounded-lg border">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">語音連續性</span>
												<span className="text-lg font-bold text-indigo-600">
													{Math.round(currentSessionData.metrics.continuity || 0)}分
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
													style={{ width: `${Math.round(currentSessionData.metrics.continuity || 0)}%` }}
												></div>
											</div>
											<div className="text-xs text-gray-500 mt-1">
												標準：70-100分 | 優秀：≥90 | 良好：75-89 | 需改進：≤74
											</div>
										</div>
									</div>

									{/* 总体评分 */}
									<div className="bg-white p-3 rounded-lg border">
										<div className="text-center">
											<div className="text-2xl font-bold text-pink-600">
												{Math.round(
													// 语速评分 (0-100)
													(Math.min(100, Math.max(0, 
														((currentSessionData.metrics.speechRate - 1.5) / 2.5) * 100
													)) * 0.25) +
													// 能量评分 (0-100)
													(Math.min(100, currentSessionData.metrics.energy || 0) * 0.25) +
													// 自信度评分 (0-100)
													(Math.min(100, currentSessionData.metrics.confidence || 0) * 0.25) +
													// 连续性评分 (0-100)
											(Math.min(100, currentSessionData.metrics.continuity || 0) * 0.25)
												)}
											</div>
											<div className="text-sm text-gray-500">總體評分</div>
											<div className="text-xs text-gray-400 mt-1">
												語速25% + 能量25% + 自信25% + 連續性25%
											</div>
										</div>
									</div>

									{/* 练习时长 */}
									<div className="bg-white p-3 rounded-lg border">
										<div className="text-center">
											<div className="text-2xl font-bold text-blue-600">
												{currentSessionData.duration}秒
											</div>
											<div className="text-sm text-gray-500">練習時長</div>
										</div>
									</div>

									{/* 行动建议 */}
									<div className="space-y-2">
										<Button 
											onClick={() => alert('測試按鈕正常！')}
											variant="outline"
											className="w-full mb-2"
										>
											🧪 測試按鈕
										</Button>
										<Button 
											onClick={runAiAnalysis}
											variant="secondary"
											disabled={isRunningAi}
											className="w-full"
										>
											{isRunningAi ? 'AI分析中...' : '開始AI分析（文字）'}
										</Button>
										{aiAnalysis && (
											<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
												<div>AI 整體分數：<span className="font-bold">{aiAnalysis?.scoreResult?.overallScore ?? '-'}</span></div>
												<div className="mt-1">面向：{Array.isArray(aiAnalysis?.scoreResult?.categories) ? aiAnalysis.scoreResult.categories.map((c:any)=>c.name+':'+c.score).join(' / ') : '—'}</div>
											</div>
										)}
										<Button 
											onClick={saveAnalysis}
											className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
										>
											💾 儲存紀錄
										</Button>
										<Button 
											onClick={() => router.push("/student/progress")}
											variant="outline"
											className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
										>
											📈 查看進步曲線
										</Button>
										{/* 完成流程 */}
										<Button 
											onClick={handleFinish}
											disabled={isFinishing}
											className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
										>
											{isFinishing ? '處理中...' : '完成並前往綜合練習'}
										</Button>
										<div className="text-xs text-gray-500 text-center">
											先可用「開始AI分析」查看文字分析；點「完成」會保存本次分析、生成5題個性化題目並前往綜合練習。
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* 个性化问题生成 */}
						<Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-2xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-purple-800">
									<Lightbulb className="w-5 h-5" />
									AI個性化問題 (GPT)
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
									<div className="text-sm text-purple-700">
										🤖 依據您輸入的自我介紹內容保存個性化問題，之後會在綜合練習中使用
									</div>
								</div>

								{!genCompleted ? (
									<div className="space-y-2">
										<Button 
											onClick={runAiAnalysis}
											disabled={isRunningAi}
											className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
										>
											{isRunningAi ? 'AI分析中...' : '開始AI分析'}
										</Button>
										<Button 
											onClick={handleFinish}
											disabled={isFinishing}
											className="w-full"
										>
											{isFinishing ? '處理中...' : '完成並前往綜合練習'}
										</Button>
									</div>
								) : (
									<div className={`p-3 rounded-lg border ${genFailed ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
										{genFailed ? '已完成保存流程。請前往綜合練習進行練習（若未立即生成，系統稍後會自動準備）。' : '已保存。個性化問題已寫入資料庫，請前往綜合練習使用。'}
										<div className="mt-2">
											<Button onClick={() => router.push('/student/combined-practice')} className="w-full">
												前往綜合練習
											</Button>
										</div>
									</div>
								)}

								{/* 個性化問題已生成並保存到資料庫，將在綜合練習中顯示 */}
								{personalizedQuestions.length > 0 && (
									<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
										<div className="text-sm text-green-700">
											✅ 已成功保存 {personalizedQuestions.length} 個個性化問題至資料庫
										</div>
										<div className="text-xs text-green-600 mt-1">
											這些問題將在綜合練習中出現，幫助您進行更針對性的練習
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* 练习历史 */}
						{analysisHistory.length > 0 && (
							<Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-2xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-gray-800">
										<Clock className="w-5 h-5" />
										本次練習歷史
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{analysisHistory.map((session, idx) => (
											<div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
												<div className="text-sm text-gray-600">
													第{idx + 1}次：{session.duration}秒
												</div>
												<div className="text-sm font-medium text-blue-600">
													{Math.round(session.metrics.confidence)}分
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}


