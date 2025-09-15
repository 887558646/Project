"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, AlertTriangle, Lightbulb, Copy, Save, History, RefreshCw, FileText, Target, BarChart3, Edit3, Mic, Play, Square, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import RealtimeSpeechAnalyzer from "@/components/RealtimeSpeechAnalyzer"

const sampleIntro = `
大家好，我是張小明，來自台北市立第一高中。從小我就對科學充滿興趣，特別是資訊科學領域。

在高中三年期間，我積極參與各種學習活動。我參加了程式設計社團，學習了Python和Java程式語言。在社團中，我不僅學會了程式設計的基礎知識，還培養了邏輯思維能力。

我曾經參與學校的科學展覽，研究主題是關於人工智慧在教育上的應用。這個研究讓我更深入了解AI技術，也讓我確定了未來想要朝資訊工程發展的方向。

除了學術方面，我也很重視品格培養。我經常參與志工服務，幫助社區的長者學習使用智慧型手機。這些經驗讓我學會了耐心和同理心。

未來我希望能夠在資管系學習更多專業知識，並將所學應用到實際問題解決中，為社會做出貢獻。
`

export default function SelfIntroPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("input")
  const [introText, setIntroText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalysis, setHasAnalysis] = useState(false)
  const [username, setUsername] = useState("")
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [transcript, setTranscript] = useState("")
  const [isIntroActive, setIsIntroActive] = useState(false)
  const [remainSec, setRemainSec] = useState(120)
  const [isCounting, setIsCounting] = useState(false)
  const [realtimeMetrics, setRealtimeMetrics] = useState<any>(null)
  const [useRealtimeAnalysis, setUseRealtimeAnalysis] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  // 四個AI分析結果
  const [scoreResult, setScoreResult] = useState<any>(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreError, setScoreError] = useState("")

  const [issuesResult, setIssuesResult] = useState<any>(null)
  const [issuesLoading, setIssuesLoading] = useState(false)
  const [issuesError, setIssuesError] = useState("")

  const [rewriteResult, setRewriteResult] = useState<string>("")
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [rewriteError, setRewriteError] = useState("")

  const [structureResult, setStructureResult] = useState<any>(null)
  const [structureLoading, setStructureLoading] = useState(false)
  const [structureError, setStructureError] = useState("")

  useEffect(() => {
    // 獲取用戶名
    const storedUsername = window.localStorage.getItem("username")
    setUsername(storedUsername || "")
    
    // 獲取歷史記錄
    if (storedUsername) {
      fetchHistory(storedUsername)
    }
  }, [])

  // 計時器效果
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

  const fetchHistory = async (username: string) => {
    try {
      const response = await fetch(`/api/self-intro/history?username=${username}`)
      const data = await response.json()
      if (data.success) {
        setHistory(data.data || [])
      }
    } catch (error) {
      console.error("獲取歷史記錄失敗:", error)
    }
  }

  // 從歷史記錄載入分析結果
  const loadFromHistory = (item: any) => {
    try {
      setActiveTab("analysis")
      setIntroText(item.introText)
      setScoreResult(item.aiAnalysis?.scoreResult)
      setIssuesResult(item.aiAnalysis?.issuesResult)
      setRewriteResult(item.aiAnalysis?.rewriteResult)
      setStructureResult(item.aiAnalysis?.structureResult)
      setHasAnalysis(true)
    } catch (error) {
      console.error("載入歷史記錄失敗:", error)
    }
  }

  const handleAnalyze = async () => {
    if (!introText.trim()) return
    
    setIsAnalyzing(true)
    setScoreLoading(true)
    setIssuesLoading(true)
    setRewriteLoading(true)
    setStructureLoading(true)

    try {
      // 評分分析
      const scorePromise = fetch("/api/self-intro/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introText, username })
      }).then(res => res.json())

      // 問題標註
      const issuesPromise = fetch("/api/self-intro/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introText, username })
      }).then(res => res.json())

      // 重寫建議
      const rewritePromise = fetch("/api/self-intro/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introText, username })
      }).then(res => res.json())

      // 結構分析
      const structurePromise = fetch("/api/self-intro/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introText, username })
      }).then(res => res.json())

      // 並行執行所有分析
      const [scoreData, issuesData, rewriteData, structureData] = await Promise.all([
        scorePromise, issuesPromise, rewritePromise, structurePromise
      ])

      // 處理結果
      if (scoreData.success) {
        setScoreResult(scoreData.result.scoreResult)
      } else {
        setScoreError(scoreData.message || "評分分析失敗")
      }

      if (issuesData.success) {
        setIssuesResult(issuesData.result.issuesResult)
      } else {
        setIssuesError(issuesData.message || "問題標註失敗")
      }

      if (rewriteData.success) {
        setRewriteResult(rewriteData.result.rewriteResult)
      } else {
        setRewriteError(rewriteData.message || "重寫建議失敗")
      }

      if (structureData.success) {
        setStructureResult(structureData.result.structureResult)
      } else {
        setStructureError(structureData.message || "結構分析失敗")
      }

      setHasAnalysis(true)
      
      // 自動跳轉到分析結果頁面
      setActiveTab('analysis')
    } catch (error) {
      console.error("分析失敗:", error)
      setScoreError("分析過程中發生錯誤")
      setIssuesError("分析過程中發生錯誤")
      setRewriteError("分析過程中發生錯誤")
      setStructureError("分析過程中發生錯誤")
    } finally {
      setIsAnalyzing(false)
      setScoreLoading(false)
      setIssuesLoading(false)
      setRewriteLoading(false)
      setStructureLoading(false)
    }
  }

  const saveAnalysis = async () => {
    if (!username || !introText.trim()) return
    setSaving(true)
    try {
      const response = await fetch("/api/self-intro/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          originalText: introText,
          analysisResults: {
            scoreResult: scoreResult,
            issuesResult: issuesResult || [],
            rewriteResult: rewriteResult,
            structureResult: structureResult
          }
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert("分析結果已保存！")
        // 重新獲取歷史記錄
        await fetchHistory(username)
      } else {
        alert("保存失敗：" + data.message)
      }
    } catch (error) {
      console.error("保存失敗:", error)
      alert("保存失敗，請稍後重試")
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const loadSample = () => {
    setIntroText(sampleIntro)
  }

  // 語音轉文字功能
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'zh-TW'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('語音識別錯誤:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // 組件卸載時停止語音識別
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.log('組件卸載時停止語音識別:', error)
        }
      }
    }
  }, [])

  // 語音控制函數
  const startIntro = () => {
    // 先確保停止之前的錄音
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.log('停止之前的錄音時發生錯誤:', error)
      }
    }
    
    setIsIntroActive(true)
    setIsCounting(true)
    setRemainSec(120)
    setTranscript("")
    setRealtimeMetrics(null)
    
    // 開始語音識別
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('開始語音識別時發生錯誤:', error)
        setIsListening(false)
      }
    }
  }

  const stopIntro = () => {
    setIsIntroActive(false)
    setIsCounting(false)
    
    // 停止語音識別
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.log('語音識別停止時發生錯誤:', error)
      }
      setIsListening(false)
    }
  }

  const resetIntro = () => {
    setIsIntroActive(false)
    setIsCounting(false)
    setRemainSec(120)
    setTranscript("")
    setRealtimeMetrics(null)
    setIntroText("")
    setHasAnalysis(false)
    setScoreResult(null)
    setIssuesResult(null)
    setRewriteResult("")
    setStructureResult(null)
    setScoreError("")
    setIssuesError("")
    setRewriteError("")
    setStructureError("")
    
    // 停止語音識別
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.log('語音識別停止時發生錯誤:', error)
      }
      setIsListening(false)
    }
  }

  // 完成自我介紹並進行GPT分析
  const handleFinish = async () => {
    if (!transcript.trim()) {
      alert("請先完成語音自我介紹")
      return
    }
    
    setIntroText(transcript)
    setIsIntroActive(false)
    setIsCounting(false)
    
    // 進行GPT分析
    await handleAnalyze()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">自我介紹分析</h1>
          </div>
          <p className="text-gray-600">AI智能分析您的自我介紹，提供專業的評分和改進建議</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">輸入內容</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!hasAnalysis}>分析結果</TabsTrigger>
            <TabsTrigger value="history">歷史記錄</TabsTrigger>
          </TabsList>

          {/* 輸入內容 */}
          <TabsContent value="input" className="space-y-6">
            {/* 語音輸入區域 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100/50">
                <CardTitle className="flex items-center gap-3 text-blue-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  語音自我介紹 (2分鐘)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* 計時器顯示 */}
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {Math.floor(remainSec / 60)}:{(remainSec % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-gray-600">剩餘時間</div>
                  </div>

                  {/* 語音狀態指示器 */}
                  {isListening && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">正在錄音中...</span>
                      </div>
                    </div>
                  )}

                  {/* 控制按鈕 */}
                  <div className="flex justify-center gap-4">
                    {!isIntroActive ? (
                      <Button
                        onClick={startIntro}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        開始語音自我介紹
                      </Button>
                    ) : (
                      <Button
                        onClick={stopIntro}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        停止錄音
                      </Button>
                    )}
                    <Button
                      onClick={resetIntro}
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      重新開始
                    </Button>
                  </div>

                  {/* 實時語音分析 */}
                  {isIntroActive && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-700 mb-3">實時語音分析</h4>
                      <RealtimeSpeechAnalyzer
                        isActive={isIntroActive}
                        onMetricsUpdate={(metrics) => {
                          setRealtimeMetrics(metrics)
                        }}
                        onAnalysisComplete={(analysis) => {
                          setRealtimeMetrics(analysis)
                          console.log("語音分析完成:", analysis)
                        }}
                      />
                    </div>
                  )}

                  {/* 實時指標顯示 */}
                  {realtimeMetrics && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-3">實時語音指標</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {realtimeMetrics.speechRate?.toFixed(1) || 'N/A'}
                          </div>
                          <div className="text-sm text-green-700">語速 (字/分)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {realtimeMetrics.energy?.toFixed(1) || 'N/A'}
                          </div>
                          <div className="text-sm text-blue-700">音量</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {realtimeMetrics.pitch?.toFixed(1) || 'N/A'}
                          </div>
                          <div className="text-sm text-purple-700">音調</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {realtimeMetrics.confidence?.toFixed(1) || 'N/A'}
                          </div>
                          <div className="text-sm text-orange-700">信心度</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 文字輸入區域 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-100/50">
                <CardTitle className="flex items-center gap-3 text-purple-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  文字輸入自我介紹
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  placeholder="請輸入您的自我介紹內容，或使用上方語音功能..."
                  className="min-h-[300px] text-base leading-relaxed border-purple-200 focus:border-purple-400 focus:ring-purple-200 rounded-xl resize-none"
                />

                {/* 語音轉文字結果 */}
                {transcript && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">語音轉文字結果</h4>
                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {transcript}
                    </div>
                    <Button
                      onClick={() => setIntroText(transcript)}
                      className="mt-3 bg-blue-500 hover:bg-blue-600 text-white"
                      size="sm"
                    >
                      使用語音轉文字結果
                    </Button>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button 
                    onClick={loadSample} 
                    variant="outline" 
                    size="lg" 
                    className="border-pink-200 text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    載入範例
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!introText.trim() || isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        分析中...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        開始分析
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 評分標準說明 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-yellow-50 border-b border-amber-100/50">
                <CardTitle className="flex items-center gap-3 text-amber-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  評分標準說明
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
                    <div className="text-lg font-bold text-yellow-800">95-100</div>
                    <div className="text-sm text-yellow-700">卓越</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                    <div className="text-lg font-bold text-green-800">90-94</div>
                    <div className="text-sm text-green-700">優秀</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                    <div className="text-lg font-bold text-blue-800">85-89</div>
                    <div className="text-sm text-blue-700">良好</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg">
                    <div className="text-lg font-bold text-indigo-800">80-84</div>
                    <div className="text-sm text-indigo-700">中等偏上</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
                    <div className="text-lg font-bold text-purple-800">75-79</div>
                    <div className="text-sm text-purple-700">中等</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg">
                    <div className="text-lg font-bold text-pink-800">70-74</div>
                    <div className="text-sm text-pink-700">中等偏下</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
                    <div className="text-lg font-bold text-orange-800">65-69</div>
                    <div className="text-sm text-orange-700">及格</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-lg">
                    <div className="text-lg font-bold text-red-800">60-64</div>
                    <div className="text-sm text-red-700">及格邊緣</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">60以下</div>
                    <div className="text-sm text-gray-700">不及格</div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>注意：</strong>評分標準已調整為更嚴謹的標準，大部分學生應落在70-85分區間，90分以上為真正優秀的內容。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 分析結果 */}
          <TabsContent value="analysis" className="space-y-6">
            {hasAnalysis && (
              <>
                {/* 整體評分 */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-100 to-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700">整體評分</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {scoreLoading && <div className="text-blue-500">AI分析中...</div>}
                      {scoreError && <div className="text-red-500">{scoreError}</div>}
                      {scoreResult && (
                        <>
                          <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-purple-600">{scoreResult.overallScore || 'N/A'}</div>
                            <div className="text-gray-600">/ 100</div>
                            <div className="mt-2">
                              {(() => {
                                const score = scoreResult.overallScore || 0;
                                if (score >= 95) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-semibold rounded-full">卓越</span>;
                                if (score >= 90) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-semibold rounded-full">優秀</span>;
                                if (score >= 85) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-sm font-semibold rounded-full">良好</span>;
                                if (score >= 80) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white text-sm font-semibold rounded-full">中等偏上</span>;
                                if (score >= 75) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-sm font-semibold rounded-full">中等</span>;
                                if (score >= 70) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-sm font-semibold rounded-full">中等偏下</span>;
                                if (score >= 65) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold rounded-full">及格</span>;
                                if (score >= 60) return <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-400 to-red-500 text-white text-sm font-semibold rounded-full">及格邊緣</span>;
                                return <span className="inline-block px-3 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-semibold rounded-full">不及格</span>;
                              })()}
                            </div>
                            <div className="mt-4 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg inline-block">
                              <strong>評分標準：</strong>
                              95-100分 卓越 | 90-94分 優秀 | 85-89分 良好 | 80-84分 中等偏上 | 75-79分 中等 | 70-74分 中等偏下 | 65-69分 及格 | 60-64分 及格邊緣 | 60分以下 不及格
                            </div>
                          </div>
                          <div className="space-y-4">
                            {scoreResult.categories?.map((category: any, index: number) => (
                              <div key={index} className="bg-white p-4 rounded-lg border">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">{category.score}%</span>
                                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${
                                          category.score >= 80 ? 'bg-green-500' :
                                          category.score >= 70 ? 'bg-blue-500' :
                                          category.score >= 60 ? 'bg-yellow-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${category.score}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{category.feedback}</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <div className="font-medium text-green-700 mb-1">優點</div>
                                    <ul className="space-y-1">
                                      {category.strengths?.map((strength: string, i: number) => (
                                        <li key={i} className="text-green-600">• {strength}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <div className="font-medium text-red-700 mb-1">缺點</div>
                                    <ul className="space-y-1">
                                      {category.weaknesses?.map((weakness: string, i: number) => (
                                        <li key={i} className="text-red-600">• {weakness}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <div className="font-medium text-blue-700 mb-1">建議</div>
                                    <ul className="space-y-1">
                                      {category.suggestions?.map((suggestion: string, i: number) => (
                                        <li key={i} className="text-blue-600">• {suggestion}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* 保存按鈕 */}
                  <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-700">保存分析結果</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          將分析結果保存到您的歷史記錄中，方便日後查看和比較。
                        </p>
                        <Button
                          onClick={saveAnalysis}
                          disabled={saving}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {saving ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              保存中...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Save className="w-4 h-4 mr-2" />
                              儲存紀錄
                            </div>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 問題標註 */}
                <Card className="bg-white/80 backdrop-blur-sm border border-red-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="bg-gradient-to-br from-red-50 to-pink-50 border-b border-red-100/50">
                    <CardTitle className="flex items-center gap-3 text-red-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </div>
                      問題標註
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {issuesLoading && <div className="text-blue-500">AI分析中...</div>}
                    {issuesError && <div className="text-red-500">{issuesError}</div>}
                    {issuesResult && issuesResult.length > 0 ? (
                      <div className="space-y-4">
                        {issuesResult.map((issue: any, index: number) => (
                          <div key={index} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                                  {issue.severity === 'high' ? '高' : issue.severity === 'medium' ? '中' : '低'}
                                </span>
                                <span className="text-sm font-medium text-gray-600">{issue.category}</span>
                              </div>
                            </div>
                            <div className="mb-2">
                              <div className="text-sm text-gray-700 mb-1">
                                <strong>問題句子：</strong>
                                <span className="bg-yellow-100 px-2 py-1 rounded ml-2">{issue.text}</span>
                              </div>
                              <div className="text-sm text-gray-700 mb-1">
                                <strong>問題原因：</strong>{issue.reason}
                              </div>
                              <div className="text-sm text-gray-700 mb-1">
                                <strong>改進建議：</strong>{issue.suggestion}
                              </div>
                              <div className="text-sm text-gray-700">
                                <strong>改進範例：</strong>
                                <span className="bg-green-100 px-2 py-1 rounded ml-2">{issue.improved_example}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>沒有發現明顯問題</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 重寫建議 */}
                <Card className="bg-white/80 backdrop-blur-sm border border-green-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100/50">
                    <CardTitle className="flex items-center gap-3 text-green-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Edit3 className="w-4 h-4 text-white" />
                      </div>
                      AI重寫建議
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {rewriteLoading && <div className="text-blue-500">AI分析中...</div>}
                    {rewriteError && <div className="text-red-500">{rewriteError}</div>}
                    {rewriteResult && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">重寫建議</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(rewriteResult)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              複製
                            </Button>
                          </div>
                          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {rewriteResult}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 結構建議 */}
                <Card className="bg-white/80 backdrop-blur-sm border border-indigo-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-indigo-100/50">
                    <CardTitle className="flex items-center gap-3 text-indigo-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      結構建議
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {structureLoading && <div className="text-blue-500">AI分析中...</div>}
                    {structureError && <div className="text-red-500">{structureError}</div>}
                    {structureResult && structureResult.length > 0 && (
                      <div className="space-y-6">
                        {structureResult.map((section: any, index: number) => (
                          <div key={index} className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                            <h4 className="text-lg font-semibold text-indigo-800 mb-4">{section.title}</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">重點內容</h5>
                                <ul className="space-y-1">
                                  {section.points?.map((point: string, i: number) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start">
                                      <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">寫作建議</h5>
                                <p className="text-sm text-gray-600 mb-3">{section.writing_tips}</p>
                                <h5 className="font-medium text-gray-700 mb-2">常見錯誤</h5>
                                <p className="text-sm text-gray-600 mb-3">{section.common_mistakes}</p>
                                <div className="text-sm text-indigo-600 font-medium">
                                  建議字數：{section.word_count}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* 歷史記錄 */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  分析歷史記錄
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => loadFromHistory(item)}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">分析記錄 #{index + 1}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(item.createdAt).toLocaleString('zh-TW')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">{item.overallScore}</div>
                            <div className="text-xs text-gray-500">/ 100</div>
                            <div className="mt-1">
                              {(() => {
                                const score = item.overallScore || 0;
                                if (score >= 95) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full">卓越</span>;
                                if (score >= 90) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-semibold rounded-full">優秀</span>;
                                if (score >= 85) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs font-semibold rounded-full">良好</span>;
                                if (score >= 80) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white text-xs font-semibold rounded-full">中等偏上</span>;
                                if (score >= 75) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs font-semibold rounded-full">中等</span>;
                                if (score >= 70) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-semibold rounded-full">中等偏下</span>;
                                if (score >= 65) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-semibold rounded-full">及格</span>;
                                if (score >= 60) return <span className="inline-block px-2 py-1 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-semibold rounded-full">及格邊緣</span>;
                                return <span className="inline-block px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-semibold rounded-full">不及格</span>;
                              })()}
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                              95-100卓越 | 90-94優秀 | 85-89良好 | 80-84中等偏上 | 75-79中等 | 70-74中等偏下 | 65-69及格 | 60-64及格邊緣 | 60以下不及格
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.introText.substring(0, 100)}...
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              loadFromHistory(item)
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            查看詳情
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>暫無歷史記錄</p>
                    <p className="text-sm">完成一次分析後，記錄將顯示在這裡</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
