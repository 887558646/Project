"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, ArrowLeft, ArrowRight, BarChart3, CheckCircle, FileText, Play, Save, Square, Video, Volume2, VolumeX, User, Target, Sparkles, Mic, Monitor } from "lucide-react"
import AdvancedVirtualInterviewer from "@/components/3d/AdvancedInterviewer"
import VoiceRecognition from "@/components/VoiceRecognition"

interface Question {
  id: number | string
  question: string
  hint: string
  category: string
  isPersonalized?: boolean
  reason?: string
}

export default function CombinedPractice() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSchool, setSelectedSchool] = useState("通用") // 新增學校選擇狀態
  const [availableSchools, setAvailableSchools] = useState<string[]>(["通用", "台大", "清大", "交大", "政大", "成大", "中央", "中山", "中興", "台科大", "北科大"])

  // Written state
  const [answers, setAnswers] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // 自動選擇可用的錄製方式（video 優先，其次 audio），不再提供模式切換
  const [captureType, setCaptureType] = useState<'video' | 'audio' | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const [speechRate, setSpeechRate] = useState(85)
  const [emotionScore, setEmotionScore] = useState(78)
  const [fillerCount, setFillerCount] = useState(0)
  const [clarityScore, setClarityScore] = useState(70)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  
  // Virtual Interviewer state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [interviewerMessage, setInterviewerMessage] = useState("")
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const [wasMutedBeforeRecording, setWasMutedBeforeRecording] = useState(false)

  // Loading
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setUsername(window.localStorage.getItem("username") || "")
  }, [])

  useEffect(() => {
    if (!username) return
    ;(async () => {
      try {
        setLoading(true)
        // 探測環境（不打開設備）：優先 video 其次 audio
        try {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const hasVideo = devices.some(d => d.kind === 'videoinput')
          const hasAudio = devices.some(d => d.kind === 'audioinput')
          setCaptureType(hasVideo ? 'video' : hasAudio ? 'audio' : null)
        } catch {
          setCaptureType(null)
        }
        const res = await fetch(`/api/written-qa/questions?username=${username}&personalized=true&school=${selectedSchool}`)
        const data = await res.json()
        if (data.success) {
          setQuestions(data.questions)
          setAnswers(new Array(data.questions.length).fill(""))
          // 初始化虛擬面試官
          if (data.questions.length > 0) {
            speakQuestion(data.questions[0])
          }
          
          // 獲取所有可用的學校列表
          try {
            const schoolsRes = await fetch("/api/written-qa/admin/questions")
            const schoolsData = await schoolsRes.json()
            if (schoolsData.success) {
              const schools = schoolsData.questions
                .map((q: any) => q.school)
                .filter((school: any): school is string => typeof school === 'string' && school !== "通用")
              const uniqueSchools = [...new Set(schools)] as string[]
              setAvailableSchools(["通用", ...uniqueSchools])
            }
          } catch (e) {
            // 如果獲取學校列表失敗，使用預設列表
            console.log("獲取學校列表失敗，使用預設列表")
          }
        } else {
          throw new Error(data.message || "獲取題目失敗")
        }
      } catch (e) {
        setError("獲取題目失敗")
      } finally {
        setLoading(false)
      }
    })()
  }, [username, selectedSchool]) // 添加selectedSchool依賴

  // 初始化語音合成
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis
    }
  }, [])

  // 教授嗓音（偏低沉、成熟）
  const professorVoiceRef = useRef<SpeechSynthesisVoice | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const ss = window.speechSynthesis

    const pickProfessorVoice = (voices: SpeechSynthesisVoice[]) => {
      if (!voices || voices.length === 0) return
      // 1) 優先挑選華語/中文、台灣或普通話
      const zhVoices = voices.filter(v => / 國語|國語|普通話|華語/i.test(`${v.lang} ${v.name}`))
      // 2) 嘗試挑選較成熟/男聲（名稱常見關鍵字，跨平台兼容）
      const maleKeywords = /(male|男|yun|bo|liang|zhiyu|yunjian|yunjie|yunxi)/i
      const mature = zhVoices.find(v => maleKeywords.test(v.name))
      // 3) 若無法判定男聲就選第一個中文語音
      professorVoiceRef.current = mature || zhVoices[0] || voices[0]
    }

    const load = () => pickProfessorVoice(ss.getVoices())
    load()
    ss.onvoiceschanged = load
    return () => {
      try { ss.onvoiceschanged = null } catch {}
    }
  }, [])

  // 虛擬面試官朗讀題目
  const speakQuestion = (question: Question) => {
    if (!speechSynthesisRef.current || isMuted) return
    
    // 停止之前的語音
    speechSynthesisRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(question.question)
    utterance.lang = 'zh-TW'
    // 老教授音色：語速略慢、音高略低
    utterance.rate = 0.85
    utterance.pitch = 0.75
    utterance.volume = 0.9
    if (professorVoiceRef.current) utterance.voice = professorVoiceRef.current
    
    utterance.onstart = () => {
      setIsSpeaking(true)
      setInterviewerMessage("正在朗讀題目...")
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
      setInterviewerMessage("請開始回答...")
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
      setInterviewerMessage("語音播放失敗")
    }
    
    speechSynthesisRef.current.speak(utterance)
  }

  // 切換靜音
  const toggleMute = () => {
    if (speechSynthesisRef.current) {
      if (isMuted) {
        speechSynthesisRef.current.resume()
      } else {
        speechSynthesisRef.current.pause()
      }
    }
    setIsMuted(!isMuted)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
        // 基於當前文本動態更新分析
        const currentText = answers[currentIndex] || ""
        updateLiveAnalysis(currentText)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleAnswerChange = (value: string) => {
    const next = [...answers]
    next[currentIndex] = value
    setAnswers(next)
  }

  // 處理語音識別結果
  const handleVoiceTranscript = (transcript: string) => {
    const next = [...answers]
    next[currentIndex] = (next[currentIndex] || "") + transcript
    setAnswers(next)
    updateLiveAnalysis(next[currentIndex])
  }

  // 录影期間實時文字（臨時+最終）直接覆蓋當前輸入內容
  const handleVoiceInterim = (text: string) => {
    const next = [...answers]
    next[currentIndex] = text
    setAnswers(next)
    updateLiveAnalysis(text)
  }

  // 由識別文字計算即時分析（簡易啟發式）
  const updateLiveAnalysis = (text: string) => {
    const seconds = Math.max(recordingTime, 1)
    // 估算中文字數：以字符長度/2 粗略估算
    const estimatedWords = Math.max(1, Math.round(text.replace(/\s/g, "").length / 2))
    const wpm = Math.min(180, Math.max(40, Math.round((estimatedWords / seconds) * 60)))
    setSpeechRate(wpm)

    // 填充詞統計
    const fillers = (text.match(/(嗯|啊|這個|那個|就是|你知道|然後)/g) || []).length
    setFillerCount(fillers)

    // 清晰度：句長適中、標點合理、填充詞少
    const sentences = text.split(/[。！？!?\.]/).filter(Boolean)
    const avgLen = sentences.length ? text.length / sentences.length : text.length
    let clarity = 80
    if (avgLen > 40) clarity -= 10
    if (avgLen > 80) clarity -= 10
    clarity -= Math.min(20, fillers * 2)
    clarity = Math.min(100, Math.max(40, Math.round(clarity)))
    setClarityScore(clarity)

    // 情緒（粗略）：感嘆號、積極詞
    const positives = (text.match(/(感謝|期待|喜歡|熱情|自信|興奮|開心|樂觀|學習)/g) || []).length
    const exclam = (text.match(/!/g) || []).length
    const emotion = Math.min(95, 65 + positives * 5 + exclam * 2)
    setEmotionScore(emotion)

    // 生成建議
    const tips: string[] = []
    if ((text || "").trim().length === 0 && isRecording) {
      tips.push("可先用三句結構：背景→做法→結果，先把框架說出來。")
    }
    if (fillers >= 3) {
      tips.push("填充詞偏多，嘗試用短暫停頓替代，如：先停0.5秒再接下一句。")
    }
    if (clarity < 70) {
      tips.push("句子偏長或重複，拆分為2-3句並在開頭亮出關鍵詞。")
    }
    if (wpm < 60) {
      tips.push("語速略慢，適度提高節奏並保持語尾有力。")
    } else if (wpm > 140) {
      tips.push("語速偏快，放慢強調詞並加入短停頓。")
    }
    if (emotion < 70) {
      tips.push("情緒表達略弱，可加入積極詞（如：主動、協作、成長）。")
    }
    if (text.trim().length > 40) {
      tips.push("結尾補一句反思/收穫，提升完整度。")
    }
    setSuggestions(tips.slice(0, 4))
  }

  const saveWrittenAnswer = async () => {
    if (!username || !answers[currentIndex]?.trim()) return
    setSaving(true)
    try {
      await fetch("/api/written-qa/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          questionId: typeof questions[currentIndex].id === "string" ? 0 : questions[currentIndex].id,
          answer: answers[currentIndex],
          analysis: {
            wordCount: answers[currentIndex].trim().split(/\s+/).length,
            clarityScore: 0,
            exaggerationScore: 0,
            issues: []
          }
        })
      })
    } catch (e) {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const startRecording = async () => {
    try {
      // 重置上一段錄影
      if (recordedBlobUrl) {
        URL.revokeObjectURL(recordedBlobUrl)
      }
      setRecordedBlob(null)
      setRecordedBlobUrl(null)
      setUploadMessage(null)

      // 設置回聲消除，避免把系統語音朗讀錄入
      const constraints = captureType === 'video'
        ? { video: true, audio: { echoCancellation: true, noiseSuppression: true } }
        : { audio: { echoCancellation: true, noiseSuppression: true } }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints as MediaStreamConstraints)
      setStream(mediaStream)
      if (captureType === 'video') {
        if (videoRef.current) videoRef.current.srcObject = mediaStream
      }

      const mimeType = captureType === 'video' ? 'video/webm' : 'audio/webm'
      const recorder = new MediaRecorder(mediaStream, { mimeType })
      recordedChunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        setRecordedBlob(blob)
        setRecordedBlobUrl(url)
        if (captureType === 'video' && videoRef.current) {
          videoRef.current.srcObject = null
          videoRef.current.src = url
          videoRef.current.controls = true
          videoRef.current.muted = false
          videoRef.current.play().catch(() => {})
        } else if (captureType === 'audio' && audioRef.current) {
          audioRef.current.src = url
          audioRef.current.controls = true
          audioRef.current.play().catch(() => {})
        }
      }
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      // 錄製開始時，暫停語音朗讀並記錄靜音狀態
      setWasMutedBeforeRecording(isMuted)
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
      setIsMuted(true)
    } catch (err) {
      console.error(err)
    }
  }

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop()
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    setIsRecording(false)
    // 錄製結束後恢復之前的靜音狀態
    setIsMuted(wasMutedBeforeRecording)
  }

  const uploadRecording = async () => {
    if (!username || !recordedBlob) return
    try {
      setIsUploading(true)
      setUploadMessage(null)
      const guessedType = captureType === 'video' ? 'video/webm' : 'audio/webm'
      const file = new File([recordedBlob], `answer_${Date.now()}.${captureType === 'video' ? 'webm' : 'weba'}`, { type: guessedType })
      const form = new FormData()
      form.append("file", file)
      form.append("username", username)
      form.append("questionId", String(typeof questions[currentIndex].id === "string" ? 0 : questions[currentIndex].id))
      form.append("questionText", questions[currentIndex].question)
      form.append("durationSec", String(recordingTime))
      form.append("speechRate", String(speechRate))
      form.append("emotionScore", String(emotionScore))
      const response = await fetch("/api/video-interview/upload", { method: "POST", body: form })
      const result = await response.json()
      if (result.success) {
        setUploadMessage("錄影已提交成功！")
        console.log("錄影提交成功:", result.data)
      } else {
        setUploadMessage(result.message || "提交失敗")
        console.error("錄影提交失敗:", result.message)
      }
    } catch (error) {
      setUploadMessage("提交發生錯誤")
      console.error("錄影提交錯誤:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const discardRecording = () => {
    if (recordedBlobUrl) {
      URL.revokeObjectURL(recordedBlobUrl)
    }
    setRecordedBlob(null)
    setRecordedBlobUrl(null)
    setUploadMessage(null)
    if (videoRef.current) {
      videoRef.current.removeAttribute("src")
      videoRef.current.load()
      videoRef.current.controls = false
    }
  }

  const previous = async () => {
    await saveWrittenAnswer()
    if (isRecording) await stopRecording()

    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1)
      // 朗讀上一題
      speakQuestion(questions[currentIndex - 1])
    }
  }

  const next = async () => {
    await saveWrittenAnswer()
    if (isRecording) await stopRecording()

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1)
      // 朗讀下一題
      speakQuestion(questions[currentIndex + 1])
    } else {
      router.push("/student/ai-feedback")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-600">載入練習題目中...</p>
        </div>
      </div>
    )
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
                <Target className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                綜合練習
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Progress Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-pink-200/50 w-fit">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                <span className="text-xs sm:text-sm font-medium text-pink-700">題目 {currentIndex + 1} / {questions.length}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800">綜合練習進行中</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="text-xs sm:text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 w-fit">
                書面 150-250 字、錄影 2-3 分鐘
              </div>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="w-32 sm:w-40 border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableSchools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school === "通用" ? "通用題目" : `${school}專屬`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/30">
            <Progress 
              value={((currentIndex + 1) / questions.length) * 100} 
              className="h-2 sm:h-3 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-full overflow-hidden"
            />
            <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-gray-600">
              <span>進度</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* 虛擬面試官 */}
          <div className="lg:col-span-4">
            <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-2xl sm:rounded-3xl h-full overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-100/50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-purple-700 text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  虛擬面試官
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AdvancedVirtualInterviewer
                  isSpeaking={isSpeaking}
                  isMuted={isMuted}
                  message={interviewerMessage}
                  onSpeak={() => speakQuestion(questions[currentIndex])}
                  onToggleMute={toggleMute}
                />
              </CardContent>
            </Card>
          </div>

          {/* 錄影/錄音區域 */}
          <div className="lg:col-span-4">
            <Card className="bg-white/80 backdrop-blur-sm border border-orange-200/50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-red-50 border-b border-orange-100/50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-orange-700 text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    {captureType === 'video' ? (
                      <Video className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </div>
                  <span className="truncate">{captureType === 'video' ? '錄影練習' : '錄音練習'}</span>
                  {captureType && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      {captureType === 'video' ? '攝影機' : '麥克風'}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* 錄影/錄音預覽 */}
                {captureType === 'video' && (
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl overflow-hidden aspect-video mb-4 sm:mb-6 shadow-lg">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                    {!stream && !recordedBlobUrl && (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center px-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Video className="w-6 h-6 sm:w-8 sm:h-8 opacity-60" />
                          </div>
                          <p className="text-sm sm:text-lg font-medium">點擊開始錄影以啟用攝影機</p>
                          <p className="text-xs sm:text-sm text-gray-300 mt-1">準備好後即可開始練習</p>
                        </div>
                      </div>
                    )}
                    {isRecording && (
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 shadow-lg">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                        REC {new Date(recordingTime * 1000).toISOString().substring(14, 19)}
                      </div>
                    )}
                  </div>
                )}

                {captureType === 'audio' && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-200/50">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">錄音預覽</span>
                    </div>
                    <audio ref={audioRef} controls className="w-full" />
                  </div>
                )}

                {/* 控制按鈕 */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-center">
                    {!isRecording ? (
                      <Button 
                        onClick={startRecording} 
                        disabled={!captureType} 
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white disabled:opacity-50 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {captureType === 'video' ? '開始錄影' : '開始錄音'}
                      </Button>
                    ) : (
                      <Button 
                        onClick={stopRecording} 
                        variant="secondary" 
                        className="bg-gray-800 text-white hover:bg-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 w-full sm:w-auto"
                      >
                        <Square className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        停止錄製
                      </Button>
                    )}
                  </div>
                  
                  {/* 提交/重錄 控制 */}
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                    <Button 
                      onClick={uploadRecording} 
                      disabled={!captureType || !recordedBlob || isUploading} 
                      className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-green-500 hover:to-emerald-500 text-white disabled:opacity-50 px-4 sm:px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isUploading ? "提交中..." : (captureType === 'video' ? '提交錄影' : '提交錄音')}
                    </Button>
                    <Button 
                      onClick={discardRecording} 
                      variant="outline" 
                      disabled={isRecording || (!recordedBlob && !recordedBlobUrl)}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50 px-4 sm:px-6 py-2 rounded-xl transition-all duration-300 flex-1 sm:flex-none"
                    >
                      重新錄製
                    </Button>
                  </div>
                  
                  {uploadMessage && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        {uploadMessage}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 書面問答區域 */}
          <div className="lg:col-span-4">
            <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100/50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-blue-700 text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  書面回答
                  {questions[currentIndex]?.isPersonalized && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      個性化
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* 題目 */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 leading-relaxed">
                    {questions[currentIndex]?.question}
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl border border-blue-200/50">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                        {questions[currentIndex]?.hint}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 回答輸入 */}
                <div className="mb-4 sm:mb-6">
                  <Textarea
                    value={answers[currentIndex] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="請在此輸入您的回答..."
                    className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base leading-relaxed border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-xl resize-none"
                  />
                  
                  {/* 語音識別提示（極簡） */}
                  <div className="mt-2 sm:mt-3">
                    <VoiceRecognition
                      onTranscript={handleVoiceTranscript}
                      onInterim={handleVoiceInterim}
                      isRecording={isRecording}
                      active={isRecording}
                      autoStart
                      disabled={false}
                      variant="minimal"
                      className="px-1"
                    />
                  </div>
                </div>

                {/* 即時建議 */}
                {suggestions.length > 0 && (
                  <div className="mb-4 sm:mb-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 text-emerald-800 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                      <span className="text-xs sm:text-sm font-semibold">即時建議</span>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm leading-relaxed">
                      {suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 底部控制 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full">
                    字數：{answers[currentIndex]?.trim().split(/\s+/).filter(Boolean).length || 0}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button 
                      onClick={previous} 
                      disabled={currentIndex === 0} 
                      variant="outline" 
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-300 disabled:opacity-50 text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      上一題
                    </Button>
                    <Button 
                      onClick={saveWrittenAnswer} 
                      disabled={saving || !answers[currentIndex]?.trim()} 
                      variant="outline" 
                      className="border-green-200 text-green-600 hover:bg-green-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {saving ? "保存中..." : "保存"}
                    </Button>
                    <Button 
                      onClick={next} 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                      {currentIndex === questions.length - 1 ? "完成練習" : "下一題"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


